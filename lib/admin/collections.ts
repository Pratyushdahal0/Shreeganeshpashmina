import { getCollections, getCollection, createCollection, updateCollection, deleteCollection } from '@/lib/actions/collections';

export type Collection = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  productCount: number;
  createdAt: string;
};

export type CollectionMutationResult =
  | { ok: true; message: string; collection?: any }
  | { ok: false; reason: string; message: string };

function transformCategory(c: any): Collection {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description || null,
    productCount: c.products?.length || 0,
    createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
  };
}

export const collectionService = {
  async list(): Promise<{ state: 'live' | 'unavailable'; collections: Collection[] }> {
    const { collections, error } = await getCollections();
    if (error || !collections) {
      return { state: 'unavailable', collections: [] };
    }
    return { state: 'live', collections: collections.map(transformCategory) };
  },

  async get(id: string): Promise<Collection | null> {
    const { collection } = await getCollection(id);
    if (!collection) return null;
    return transformCategory(collection);
  },

  async create(input: { name: string; slug?: string; description?: string }): Promise<CollectionMutationResult> {
    const res = await createCollection(input);
    if (res.error || !res.collection) {
      return { ok: false, reason: 'error', message: res.error || 'Failed to create collection' };
    }
    return { ok: true, message: 'Collection created successfully', collection: res.collection };
  },

  async update(id: string, input: { name?: string; slug?: string; description?: string }): Promise<CollectionMutationResult> {
    const res = await updateCollection(id, input);
    if (res.error || !res.collection) {
      return { ok: false, reason: 'error', message: res.error || 'Failed to update collection' };
    }
    return { ok: true, message: 'Collection updated successfully', collection: res.collection };
  },

  async delete(id: string): Promise<CollectionMutationResult> {
    const res = await deleteCollection(id);
    if (res.error) {
      return { ok: false, reason: 'error', message: res.error };
    }
    return { ok: true, message: 'Collection deleted successfully' };
  },
};
