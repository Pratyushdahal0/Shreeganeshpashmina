import { productCategories, type AdminProduct } from '@/lib/admin/products';

export type Collection = { id: string; slug: string; name: string; description: string | null; image: string | null; productIds: string[]; featured: boolean | null; position: number | null; status: 'unavailable' | 'active' | 'archived'; seoTitle: string | null; seoDescription: string | null };
export type CollectionInput = Pick<Collection, 'name' | 'slug' | 'description' | 'image' | 'productIds' | 'featured' | 'position' | 'seoTitle' | 'seoDescription'>;
export type CollectionMutationResult = { ok: false; reason: 'persistence_unavailable'; message: string };

export interface CollectionService { list(): Promise<{ state: 'static' | 'live' | 'unavailable'; collections: Collection[] }>; get(slug: string): Promise<Collection | null>; create(input: CollectionInput): Promise<CollectionMutationResult>; update(slug: string, input: CollectionInput): Promise<CollectionMutationResult>; archive(slug: string): Promise<CollectionMutationResult>; restore(slug: string): Promise<CollectionMutationResult>; setProducts(slug: string, productIds: string[]): Promise<CollectionMutationResult>; }

/** Existing storefront categories are the only collection-like source. No collection records are fabricated. */
export const collectionService: CollectionService = {
  async list() { return { state: 'static' as const, collections: productCategories.map((name) => ({ id: name.toLowerCase(), slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name, description: null, image: null, productIds: [], featured: null, position: null, status: 'unavailable' as const, seoTitle: null, seoDescription: null })) }; },
  async get(slug) { return (await this.list()).collections.find((collection) => collection.slug === slug) ?? null; },
  async create() { return unavailable(); }, async update() { return unavailable(); }, async archive() { return unavailable(); }, async restore() { return unavailable(); }, async setProducts() { return unavailable(); },
};
const unavailable = (): CollectionMutationResult => ({ ok: false, reason: 'persistence_unavailable', message: 'Collection changes cannot be saved until a catalogue API or database is connected.' });
