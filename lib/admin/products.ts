import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '@/lib/actions/products';

export type ProductDataState = 'static' | 'live' | 'unavailable';
export type PublicationStatus = 'unavailable' | 'draft' | 'published' | 'archived';
export type ProductSort = 'name-asc' | 'price-asc' | 'price-desc';

export type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  material: string;
  price: number;
  currency: string;
  images: string[];
  colors: string[];
  sizes: string[];
  stock: number;
  description: string;
  sku: string | null;
  publicationStatus: PublicationStatus;
  stockStatus: 'unavailable' | 'in_stock' | 'out_of_stock';
  updatedAt: string | null;
  variants: ProductVariant[];
};

export type ProductVariant = {
  id: string;
  sku: string | null;
  price: number | null;
  stock: number | null;
  available: boolean | null;
  attributes: Record<string, string>;
  image: string | null;
};

export type ProductListParams = { query?: string; category?: string; sort?: ProductSort };
export type ProductMutationResult =
  | { ok: true; message: string; product?: any }
  | { ok: false; reason: string; message: string };

export type ProductInput = {
  name: string;
  slug: string;
  sku?: string;
  description?: string;
  category?: string;
  categoryId?: string;
  price?: number;
  stock?: number;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  imageUrl?: string;
};

function transformPrismaProduct(p: any): AdminProduct {
  const variant = p.variants?.[0];
  const price = variant?.price ? Number(variant.price) : 0;
  const stock = p.variants?.reduce((acc: number, v: any) => acc + (v.inventory || 0), 0) ?? 0;
  const statusMap: Record<string, PublicationStatus> = {
    PUBLISHED: 'published',
    DRAFT: 'draft',
    ARCHIVED: 'archived',
  };

  return {
    id: p.id,
    name: p.title,
    slug: p.handle,
    category: p.category?.name || 'Uncategorized',
    material: 'Pashmina',
    price,
    currency: 'USD',
    images: p.images?.map((img: any) => img.url) || [],
    colors: [],
    sizes: [],
    stock,
    description: p.description || '',
    sku: variant?.sku || null,
    publicationStatus: statusMap[p.status] || 'draft',
    stockStatus: stock > 0 ? 'in_stock' : 'out_of_stock',
    updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : null,
    variants: (p.variants || []).map((v: any) => ({
      id: v.id,
      sku: v.sku,
      price: v.price ? Number(v.price) : 0,
      stock: v.inventory,
      available: (v.inventory || 0) > 0,
      attributes: {},
      image: null,
    })),
  };
}

export const productService = {
  async list(params: ProductListParams = {}): Promise<{ state: ProductDataState; products: AdminProduct[] }> {
    const { products, error } = await getProducts();
    if (error || !products) {
      return { state: 'unavailable', products: [] };
    }

    let result = products.map(transformPrismaProduct);

    if (params.query?.trim()) {
      const q = params.query.trim().toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }
    if (params.category && params.category !== 'all') {
      result = result.filter((p) => p.category === params.category);
    }
    if (params.sort === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (params.sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (params.sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return { state: 'live', products: result };
  },

  async get(id: string): Promise<AdminProduct | null> {
    const { product } = await getProduct(id);
    if (!product) return null;
    return transformPrismaProduct(product);
  },

  async create(input: ProductInput): Promise<ProductMutationResult> {
    const res = await createProduct({
      title: input.name,
      handle: input.slug,
      description: input.description,
      price: input.price,
      stock: input.stock,
      sku: input.sku,
      status: input.status || 'DRAFT',
      categoryId: input.categoryId,
      imageUrl: input.imageUrl,
    });
    if (res.error) {
      return { ok: false, reason: 'error', message: res.error };
    }
    return { ok: true, message: 'Product created successfully', product: res.product };
  },

  async update(id: string, input: ProductInput): Promise<ProductMutationResult> {
    const res = await updateProduct(id, {
      title: input.name,
      handle: input.slug,
      description: input.description,
      price: input.price,
      stock: input.stock,
      sku: input.sku,
      status: input.status,
      categoryId: input.categoryId,
      imageUrl: input.imageUrl,
    });
    if (res.error) {
      return { ok: false, reason: 'error', message: res.error };
    }
    return { ok: true, message: 'Product updated successfully', product: res.product };
  },

  async archive(id: string): Promise<ProductMutationResult> {
    const res = await updateProduct(id, { status: 'ARCHIVED' });
    if (res.error) return { ok: false, reason: 'error', message: res.error };
    return { ok: true, message: 'Product archived' };
  },

  async publish(id: string): Promise<ProductMutationResult> {
    const res = await updateProduct(id, { status: 'PUBLISHED' });
    if (res.error) return { ok: false, reason: 'error', message: res.error };
    return { ok: true, message: 'Product published' };
  },

  async unpublish(id: string): Promise<ProductMutationResult> {
    const res = await updateProduct(id, { status: 'DRAFT' });
    if (res.error) return { ok: false, reason: 'error', message: res.error };
    return { ok: true, message: 'Product set to draft' };
  },

  async delete(id: string): Promise<ProductMutationResult> {
    const res = await deleteProduct(id);
    if (res.error) return { ok: false, reason: 'error', message: res.error };
    return { ok: true, message: 'Product deleted' };
  },
};

export const productCategories = [
  'Cashmere Shawls',
  'Ring Pashmina',
  'Embroidered Stoles',
  'Gradient Scarves',
  'Jacquard Weaves',
];
