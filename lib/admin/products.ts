import { categories, products, type Product as StorefrontProduct } from '@/lib/data';

export type ProductDataState = 'static' | 'live' | 'unavailable';
export type PublicationStatus = 'unavailable' | 'draft' | 'published' | 'archived';
export type ProductSort = 'name-asc' | 'price-asc' | 'price-desc';

export type AdminProduct = StorefrontProduct & {
  sku: string | null;
  publicationStatus: PublicationStatus;
  stockStatus: 'unavailable' | 'in_stock' | 'out_of_stock';
  updatedAt: string | null;
  variants: ProductVariant[];
};

export type ProductVariant = { id: string; sku: string | null; price: number | null; stock: number | null; available: boolean | null; attributes: Record<string, string>; image: string | null };
export type ProductListParams = { query?: string; category?: string; sort?: ProductSort };
export type ProductMutationResult = { ok: false; reason: 'persistence_unavailable'; message: string };
export type ProductInput = { name: string; slug: string; sku?: string; description?: string; category?: string; price?: number; material?: string; tags?: string[] };

export interface ProductService {
  list(params?: ProductListParams): Promise<{ state: ProductDataState; products: AdminProduct[] }>;
  get(id: string): Promise<AdminProduct | null>;
  create(input: ProductInput): Promise<ProductMutationResult>;
  update(id: string, input: ProductInput): Promise<ProductMutationResult>;
  duplicate(id: string): Promise<ProductMutationResult>;
  archive(id: string): Promise<ProductMutationResult>;
  restore(id: string): Promise<ProductMutationResult>;
  publish(id: string): Promise<ProductMutationResult>;
  unpublish(id: string): Promise<ProductMutationResult>;
}

const asAdminProduct = (product: StorefrontProduct): AdminProduct => ({
  ...product, sku: null, publicationStatus: 'unavailable', stockStatus: 'unavailable', updatedAt: null, variants: [],
});

const noPersistence = (): ProductMutationResult => ({ ok: false, reason: 'persistence_unavailable', message: 'Product changes cannot be saved until a product API or database is connected.' });

/** Adapter over the existing storefront catalogue. Replace with the authenticated product API when available. */
export const productService: ProductService = {
  async list(params = {}) {
    const query = params.query?.trim().toLowerCase();
    let result = products.map(asAdminProduct);
    if (query) result = result.filter((product) => [product.name, product.slug, product.category].some((value) => value.toLowerCase().includes(query)));
    if (params.category && params.category !== 'all') result = result.filter((product) => product.category === params.category);
    if (params.sort === 'name-asc') result.sort((a, b) => a.name.localeCompare(b.name));
    if (params.sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (params.sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    return { state: 'static' as const, products: result };
  },
  async get(id) { return products.find((product) => product.id === id) ? asAdminProduct(products.find((product) => product.id === id)!) : null; },
  async create() { return noPersistence(); }, async update() { return noPersistence(); }, async duplicate() { return noPersistence(); },
  async archive() { return noPersistence(); }, async restore() { return noPersistence(); }, async publish() { return noPersistence(); }, async unpublish() { return noPersistence(); },
};

export const productCategories = categories.filter((category) => category !== 'All Pashmina');
