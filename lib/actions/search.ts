'use server';

import prisma from '@/lib/db';

export type AdminSearchResult = { id: string; label: string; detail: string; href: string };

export async function searchAdmin(query: string): Promise<{ results: AdminSearchResult[]; error: string | null }> {
  const q = query.trim();
  if (q.length < 2) return { results: [], error: null };
  try {
    const [products, orders, customers] = await Promise.all([
      prisma.product.findMany({ where: { OR: [{ title: { contains: q, mode: 'insensitive' } }, { handle: { contains: q, mode: 'insensitive' } }] }, select: { id: true, title: true, handle: true }, take: 5 }),
      prisma.order.findMany({ where: { orderNumber: { contains: q, mode: 'insensitive' } }, select: { id: true, orderNumber: true, total: true }, take: 5 }),
      prisma.customer.findMany({ where: { OR: [{ email: { contains: q, mode: 'insensitive' } }, { firstName: { contains: q, mode: 'insensitive' } }, { lastName: { contains: q, mode: 'insensitive' } }] }, select: { id: true, email: true, firstName: true, lastName: true }, take: 5 }),
    ]);
    return {
      results: [
        ...products.map(product => ({ id: `product-${product.id}`, label: product.title, detail: `Product · ${product.handle}`, href: `/admin/products/${product.id}` })),
        ...orders.map(order => ({ id: `order-${order.id}`, label: order.orderNumber, detail: `Order · $${order.total.toString()}`, href: `/admin/orders/${order.id}` })),
        ...customers.map(customer => ({ id: `customer-${customer.id}`, label: [customer.firstName, customer.lastName].filter(Boolean).join(' ') || customer.email, detail: `Customer · ${customer.email}`, href: `/admin/customers/${customer.id}` })),
      ],
      error: null,
    };
  } catch {
    return { results: [], error: 'Search is temporarily unavailable.' };
  }
}
