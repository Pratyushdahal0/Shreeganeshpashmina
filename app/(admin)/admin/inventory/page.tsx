import Inventory from '@/components/admin/inventory/Inventory'; 
import { getInventory } from '@/lib/actions/inventory';

export default async function InventoryPage() {
  const { products } = await getInventory();
  return <Inventory products={products || []} />
}
