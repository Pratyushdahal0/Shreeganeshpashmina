import Customers from '@/components/admin/customers/Customers'; 
import { getCustomers } from '@/lib/actions/customers';

export default async function CustomersPage() {
  const { customers } = await getCustomers();
  return <Customers customers={customers || []} />
}
