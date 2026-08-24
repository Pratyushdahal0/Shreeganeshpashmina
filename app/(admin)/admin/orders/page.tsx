import Orders from '@/components/admin/orders/Orders'; 
import { getOrders } from '@/lib/actions/orders';

export default async function OrdersPage() {
  const { orders } = await getOrders();
  return <Orders orders={orders || []} />
}
