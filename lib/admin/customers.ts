import { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer } from '@/lib/actions/customers';

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
};

export type CustomerMutationResult =
  | { ok: true; message: string; customer?: any }
  | { ok: false; reason: string; message: string };

function transformCustomer(c: any): Customer {
  const name = `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Customer';
  const totalOrders = c.orders?.length || 0;
  const totalSpent = (c.orders || []).reduce((sum: number, o: any) => sum + Number(o.total || 0), 0);

  return {
    id: c.id,
    name,
    email: c.email,
    phone: c.phone || null,
    totalOrders,
    totalSpent,
    createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
  };
}

export const customerService = {
  async list(query?: string): Promise<{ state: 'live' | 'unavailable'; customers: Customer[] }> {
    const { customers, error } = await getCustomers();
    if (error || !customers) {
      return { state: 'unavailable', customers: [] };
    }

    let result = customers.map(transformCustomer);
    if (query?.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.phone && c.phone.includes(q))
      );
    }
    return { state: 'live', customers: result };
  },

  async get(id: string): Promise<Customer | null> {
    const { customer } = await getCustomer(id);
    if (!customer) return null;
    return transformCustomer(customer);
  },

  async create(input: { firstName?: string; lastName?: string; email: string; phone?: string }): Promise<CustomerMutationResult> {
    const res = await createCustomer(input);
    if (res.error || !res.customer) {
      return { ok: false, reason: 'error', message: res.error || 'Failed to create customer' };
    }
    return { ok: true, message: 'Customer created successfully', customer: res.customer };
  },

  async update(id: string, input: { firstName?: string; lastName?: string; email?: string; phone?: string }): Promise<CustomerMutationResult> {
    const res = await updateCustomer(id, input);
    if (res.error || !res.customer) {
      return { ok: false, reason: 'error', message: res.error || 'Failed to update customer' };
    }
    return { ok: true, message: 'Customer updated successfully', customer: res.customer };
  },

  async delete(id: string): Promise<CustomerMutationResult> {
    const res = await deleteCustomer(id);
    if (res.error) {
      return { ok: false, reason: 'error', message: res.error };
    }
    return { ok: true, message: 'Customer deleted successfully' };
  },
};
