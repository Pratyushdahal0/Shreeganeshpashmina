import { getInventory, updateInventory } from '@/lib/actions/inventory';

export type InventoryRecord = {
  id: string;
  variantId: string;
  productId: string;
  productName: string;
  category: string;
  sku: string;
  stock: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
};

export type InventoryMutationResult =
  | { ok: true; message: string; record?: any }
  | { ok: false; reason: string; message: string };

export const inventoryService = {
  async list(): Promise<{ state: 'live' | 'unavailable'; records: InventoryRecord[] }> {
    const { products, error } = await getInventory();
    if (error || !products) {
      return { state: 'unavailable', records: [] };
    }

    const records: InventoryRecord[] = [];

    for (const p of products) {
      for (const v of p.variants) {
        const stock = v.inventory || 0;
        let status: 'in_stock' | 'low_stock' | 'out_of_stock' = 'in_stock';
        if (stock === 0) status = 'out_of_stock';
        else if (stock <= 5) status = 'low_stock';

        records.push({
          id: `${p.id}-${v.id}`,
          productId: p.id,
          variantId: v.id,
          productName: p.title,
          category: (p as any).category?.name || 'Uncategorized',
          sku: v.sku || `SGP-${p.id.slice(0, 5)}`,
          stock,
          status,
        });
      }
    }

    return { state: 'live', records };
  },

  async adjust(variantId: string, quantity: number): Promise<InventoryMutationResult> {
    const { variant, error } = await updateInventory(variantId, quantity);
    if (error || !variant) {
      return { ok: false, reason: 'error', message: error || 'Failed to adjust inventory' };
    }
    return { ok: true, message: 'Inventory adjusted successfully' };
  },
};
