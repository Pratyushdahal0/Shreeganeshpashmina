'use server';

import prisma from '@/lib/db';
import { ProductStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export type ProductImageInput = {
  url: string;
  thumbUrl?: string | null;
  alt?: string | null;
};

const productCardSelect = {
  id: true,
  title: true,
  handle: true,
  description: true,
  status: true,
  createdAt: true,
  category: { select: { id: true, name: true } },
  variants: {
    orderBy: { createdAt: 'asc' as const },
    take: 1,
    select: { id: true, price: true, inventory: true, sku: true },
  },
  images: {
    orderBy: [{ sortOrder: 'asc' as const }, { createdAt: 'asc' as const }],
    take: 1,
    select: { url: true, thumbUrl: true, alt: true },
  },
};

function revalidateProductPaths(handle?: string | null, id?: string) {
  try {
    revalidatePath('/admin/products');
    revalidatePath('/admin/inventory');
    revalidatePath('/admin');
    revalidatePath('/shop');
    revalidatePath('/');
    if (id) revalidatePath(`/admin/products/${id}`);
    if (handle) revalidatePath(`/product/${handle}`);
  } catch {
    // Ignore revalidation outside Next.js request context
  }
}

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: { select: { id: true, name: true } },
        variants: { select: { id: true, price: true, compareAtPrice: true, inventory: true, sku: true, title: true } },
        images: {
          orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
          select: { id: true, url: true, thumbUrl: true, alt: true, sortOrder: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { products, error: null };
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return { products: [], error: 'Failed to fetch products from database' };
  }
}

export async function getPublishedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { status: ProductStatus.PUBLISHED },
      select: productCardSelect,
      orderBy: { createdAt: 'desc' },
    });
    return { products, error: null };
  } catch (error: any) {
    console.error('Error fetching published products:', error);
    return { products: [], error: 'Failed to fetch products' };
  }
}

export async function getProductByHandle(handle: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { handle },
      include: {
        category: { select: { id: true, name: true } },
        variants: {
          orderBy: { createdAt: 'asc' },
          select: { id: true, title: true, price: true, compareAtPrice: true, inventory: true, sku: true },
        },
        images: {
          orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
          select: { id: true, url: true, thumbUrl: true, alt: true, sortOrder: true },
        },
      },
    });
    return { product, error: null };
  } catch (error: any) {
    console.error('Error fetching product by handle:', error);
    return { product: null, error: 'Failed to fetch product' };
  }
}

export async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true,
        images: { orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] },
      },
    });
    return { product, error: null };
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return { product: null, error: 'Failed to fetch product' };
  }
}

function normalizeImages(data: { imageUrl?: string; images?: ProductImageInput[] }): ProductImageInput[] {
  if (Array.isArray(data.images)) {
    return data.images.filter(img => img?.url?.trim()).map(img => ({
      url: img.url.trim(),
      thumbUrl: img.thumbUrl?.trim() || null,
      alt: img.alt?.trim() || null,
    }));
  }
  if (data.imageUrl?.trim()) {
    return [{ url: data.imageUrl.trim(), thumbUrl: null, alt: null }];
  }
  return [];
}

export async function createProduct(data: {
  title: string;
  handle?: string;
  description?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  categoryId?: string;
  price?: number;
  compareAtPrice?: number;
  sku?: string;
  stock?: number;
  imageUrl?: string;
  images?: ProductImageInput[];
}) {
  try {
    if (!data.title || !data.title.trim()) {
      return { product: null, error: 'Product title is required' };
    }

    const title = data.title.trim();
    const handle =
      data.handle?.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') ||
      title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const price = typeof data.price === 'number' && data.price >= 0 ? data.price : 0;
    const compareAtPrice = typeof data.compareAtPrice === 'number' && data.compareAtPrice >= 0 ? data.compareAtPrice : null;
    const inventory = typeof data.stock === 'number' && data.stock >= 0 ? data.stock : 0;
    const sku = data.sku?.trim() || null;
    const status = data.status || 'DRAFT';
    const images = normalizeImages(data);

    const product = await prisma.product.create({
      data: {
        title,
        handle,
        description: data.description || '',
        status,
        categoryId: data.categoryId || null,
        images:
          images.length > 0
            ? {
                create: images.map((img, index) => ({
                  url: img.url,
                  thumbUrl: img.thumbUrl,
                  alt: img.alt || title,
                  sortOrder: index,
                })),
              }
            : undefined,
        variants: {
          create: [
            {
              title: 'Default Title',
              sku,
              price,
              compareAtPrice,
              inventory,
            },
          ],
        },
      },
      include: {
        category: true,
        variants: true,
        images: true,
      },
    });

    revalidateProductPaths(handle, product.id);
    return { product, error: null };
  } catch (error: any) {
    console.error('Error creating product:', error);
    if (error.code === 'P2002') {
      return { product: null, error: 'A product with this handle/slug already exists' };
    }
    return { product: null, error: 'Failed to create product in database' };
  }
}

export async function updateProduct(
  id: string,
  data: {
    title?: string;
    handle?: string;
    description?: string;
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    categoryId?: string;
    price?: number;
    compareAtPrice?: number;
    sku?: string;
    stock?: number;
    imageUrl?: string;
    images?: ProductImageInput[];
  }
) {
  try {
    const existing = await prisma.product.findUnique({
      where: { id },
      include: { variants: { take: 1, orderBy: { createdAt: 'asc' } } },
    });

    if (!existing) {
      return { product: null, error: 'Product not found' };
    }

    const title = data.title?.trim() ?? existing.title;
    const handle =
      data.handle?.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') ?? existing.handle;
    const status = data.status ?? existing.status;
    const categoryId = data.categoryId !== undefined ? data.categoryId : existing.categoryId;
    const replaceImages = data.images !== undefined || data.imageUrl !== undefined;
    const images = replaceImages ? normalizeImages(data) : null;

    const product = await prisma.$transaction(async tx => {
      if (replaceImages) {
        await tx.image.deleteMany({ where: { productId: id } });
        if (images && images.length > 0) {
          await tx.image.createMany({
            data: images.map((img, index) => ({
              url: img.url,
              thumbUrl: img.thumbUrl,
              alt: img.alt || title,
              sortOrder: index,
              productId: id,
            })),
          });
        }
      }

      if (existing.variants.length > 0 && (data.price !== undefined || data.stock !== undefined || data.sku !== undefined || data.compareAtPrice !== undefined)) {
        const firstVariant = existing.variants[0];
        await tx.variant.update({
          where: { id: firstVariant.id },
          data: {
            price: typeof data.price === 'number' && data.price >= 0 ? data.price : firstVariant.price,
            compareAtPrice: typeof data.compareAtPrice === 'number' ? data.compareAtPrice : firstVariant.compareAtPrice,
            inventory: typeof data.stock === 'number' && data.stock >= 0 ? data.stock : firstVariant.inventory,
            sku: data.sku !== undefined ? data.sku.trim() || null : firstVariant.sku,
          },
        });
      }

      return tx.product.update({
        where: { id },
        data: {
          title,
          handle,
          description: data.description ?? existing.description,
          status,
          categoryId,
        },
        include: {
          category: true,
          variants: true,
          images: { orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] },
        },
      });
    });

    revalidateProductPaths(handle, id);
    return { product, error: null };
  } catch (error: any) {
    console.error('Error updating product:', error);
    return { product: null, error: 'Failed to update product' };
  }
}

export async function deleteProduct(id: string) {
  try {
    const existing = await prisma.product.findUnique({ where: { id }, select: { handle: true } });
    await prisma.product.delete({
      where: { id },
    });
    revalidateProductPaths(existing?.handle, id);
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return { success: false, error: 'Failed to delete product' };
  }
}

export type ProductImportRow = {
  title: string;
  handle?: string;
  description?: string;
  category?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  price?: number;
  compareAtPrice?: number;
  sku?: string;
  stock?: number;
  imageUrl?: string;
};

const validStatuses = new Set(['DRAFT', 'PUBLISHED', 'ARCHIVED']);

function importHandle(row: ProductImportRow) {
  return (row.handle || row.title)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Creates new products and updates products with a matching handle. */
export async function importProducts(rows: ProductImportRow[]) {
  if (!Array.isArray(rows) || rows.length === 0) return { imported: 0, updated: 0, errors: ['Choose a CSV with at least one product row.'] };
  if (rows.length > 250) return { imported: 0, updated: 0, errors: ['Import is limited to 250 rows at a time.'] };

  let imported = 0;
  let updated = 0;
  const errors: string[] = [];

  for (const [index, row] of rows.entries()) {
    const line = index + 2;
    const title = row.title?.trim();
    const handle = importHandle(row);
    if (!title || !handle) {
      errors.push(`Row ${line}: title is required.`);
      continue;
    }

    try {
      const categoryName = row.category?.trim();
      const category = categoryName
        ? await prisma.category.upsert({
            where: { slug: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') },
            update: { name: categoryName },
            create: { name: categoryName, slug: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') },
          })
        : null;
      const status = validStatuses.has(row.status || '') ? row.status! : 'DRAFT';
      const price = Number.isFinite(row.price) && row.price! >= 0 ? row.price! : 0;
      const stock = Number.isFinite(row.stock) && row.stock! >= 0 ? Math.floor(row.stock!) : 0;
      const existing = await prisma.product.findUnique({ where: { handle }, include: { variants: { take: 1, orderBy: { createdAt: 'asc' } } } });

      if (existing) {
        await updateProduct(existing.id, { title, handle, description: row.description, categoryId: category?.id, status, price, compareAtPrice: row.compareAtPrice, sku: row.sku, stock, imageUrl: row.imageUrl });
        updated++;
      } else {
        const result = await createProduct({ title, handle, description: row.description, categoryId: category?.id, status, price, compareAtPrice: row.compareAtPrice, sku: row.sku, stock, imageUrl: row.imageUrl });
        if (result.error) errors.push(`Row ${line}: ${result.error}`);
        else imported++;
      }
    } catch {
      errors.push(`Row ${line}: could not be imported.`);
    }
  }

  revalidateProductPaths();
  return { imported, updated, errors };
}
