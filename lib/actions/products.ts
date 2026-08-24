'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        variants: true,
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return { products, error: null };
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return { products: [], error: 'Failed to fetch products from database' };
  }
}

// ── Storefront: only PUBLISHED products with all data ─────────────────────────
export async function getPublishedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        category: true,
        variants: { orderBy: { createdAt: 'asc' } },
        images: { orderBy: { createdAt: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { products, error: null };
  } catch (error: any) {
    console.error('Error fetching published products:', error);
    return { products: [], error: 'Failed to fetch products' };
  }
}

// ── Storefront: single product by handle (slug) ───────────────────────────────
export async function getProductByHandle(handle: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { handle },
      include: {
        category: true,
        variants: { orderBy: { createdAt: 'asc' } },
        images: { orderBy: { createdAt: 'asc' } },
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
        images: true,
      },
    });
    return { product, error: null };
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return { product: null, error: 'Failed to fetch product' };
  }
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

    const product = await prisma.product.create({
      data: {
        title,
        handle,
        description: data.description || '',
        status,
        categoryId: data.categoryId || null,
        images: data.imageUrl ? { create: [{ url: data.imageUrl, alt: title }] } : undefined,
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

    revalidatePath('/admin/products');
    revalidatePath('/admin/inventory');
    revalidatePath('/admin');
    revalidatePath('/shop');
    revalidatePath('/');
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
  }
) {
  try {
    const existing = await prisma.product.findUnique({
      where: { id },
      include: { variants: true, images: true },
    });

    if (!existing) {
      return { product: null, error: 'Product not found' };
    }

    const title = data.title?.trim() ?? existing.title;
    const handle =
      data.handle?.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') ?? existing.handle;
    const status = data.status ?? existing.status;
    const categoryId = data.categoryId !== undefined ? data.categoryId : existing.categoryId;

    const product = await prisma.product.update({
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
        images: true,
      },
    });

    // Update main image if provided
    if (data.imageUrl !== undefined) {
      await prisma.image.deleteMany({ where: { productId: id } });
      if (data.imageUrl) {
        await prisma.image.create({
          data: {
            url: data.imageUrl,
            alt: title,
            productId: id,
          },
        });
      }
    }

    // Update main variant if price/stock/sku provided
    if (existing.variants.length > 0) {
      const firstVariant = existing.variants[0];
      await prisma.variant.update({
        where: { id: firstVariant.id },
        data: {
          price: typeof data.price === 'number' && data.price >= 0 ? data.price : firstVariant.price,
          compareAtPrice: typeof data.compareAtPrice === 'number' ? data.compareAtPrice : firstVariant.compareAtPrice,
          inventory: typeof data.stock === 'number' && data.stock >= 0 ? data.stock : firstVariant.inventory,
          sku: data.sku !== undefined ? data.sku.trim() || null : firstVariant.sku,
        },
      });
    }

    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${id}`);
    revalidatePath('/admin/inventory');
    revalidatePath('/admin');
    revalidatePath('/shop');
    revalidatePath('/');
    revalidatePath(`/product/${handle}`);
    return { product, error: null };
  } catch (error: any) {
    console.error('Error updating product:', error);
    return { product: null, error: 'Failed to update product' };
  }
}

export async function deleteProduct(id: string) {
  try {
    const existing = await prisma.product.findUnique({ where: { id } });
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath('/admin/products');
    revalidatePath('/admin/inventory');
    revalidatePath('/admin');
    revalidatePath('/shop');
    revalidatePath('/');
    if (existing?.handle) revalidatePath(`/product/${existing.handle}`);
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return { success: false, error: 'Failed to delete product' };
  }
}
