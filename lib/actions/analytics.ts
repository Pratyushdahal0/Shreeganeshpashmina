'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export type DatePreset = 'today' | 'yesterday' | 'last7days' | 'last30days' | 'last90days' | 'thisYear';

function dateRange(preset: DatePreset): { gte: Date; lte: Date } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  switch (preset) {
    case 'today':
      return { gte: today, lte: now };
    case 'yesterday': {
      const y = new Date(today); y.setDate(y.getDate() - 1);
      return { gte: y, lte: today };
    }
    case 'last7days': {
      const d = new Date(today); d.setDate(d.getDate() - 7);
      return { gte: d, lte: now };
    }
    case 'last30days': {
      const d = new Date(today); d.setDate(d.getDate() - 30);
      return { gte: d, lte: now };
    }
    case 'last90days': {
      const d = new Date(today); d.setDate(d.getDate() - 90);
      return { gte: d, lte: now };
    }
    case 'thisYear': {
      const d = new Date(now.getFullYear(), 0, 1);
      return { gte: d, lte: now };
    }
    default:
      return { gte: today, lte: now };
  }
}

export async function getSalesAnalytics(preset: DatePreset = 'last30days') {
  try {
    const range = dateRange(preset);

    const [ordersInRange, totalOrders, totalCustomers] = await Promise.all([
      prisma.order.findMany({
        where: { createdAt: range },
        include: { items: { include: { product: { select: { title: true } } } } },
      }),
      prisma.order.count(),
      prisma.customer.count(),
    ]);

    const revenue = ordersInRange.reduce((sum, o) => sum + Number(o.total), 0);
    const orderCount = ordersInRange.length;
    const avgOrderValue = orderCount > 0 ? revenue / orderCount : 0;

    // Sales by product
    const productMap: Record<string, { title: string; total: number }> = {};
    for (const order of ordersInRange) {
      for (const item of order.items) {
        const key = item.productId;
        if (!productMap[key]) productMap[key] = { title: item.product?.title || 'Unknown', total: 0 };
        productMap[key].total += Number(item.price) * item.quantity;
      }
    }
    const salesByProduct = Object.values(productMap)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)
      .map(({ title, total }) => ({ date: title, value: total }));

    // Sales by day
    const dayMap: Record<string, number> = {};
    for (const order of ordersInRange) {
      const day = order.createdAt.toISOString().split('T')[0];
      dayMap[day] = (dayMap[day] || 0) + Number(order.total);
    }
    const salesByPeriod = Object.entries(dayMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, value]) => ({ date, value }));

    return {
      metrics: {
        revenue: { label: 'Revenue', value: revenue, change: null },
        orders: { label: 'Orders', value: orderCount, change: null },
        avgOrderValue: { label: 'Avg order value', value: avgOrderValue, change: null },
        totalOrders: { label: 'Total orders (all time)', value: totalOrders, change: null },
        totalCustomers: { label: 'Total customers', value: totalCustomers, change: null },
      },
      salesByPeriod,
      salesByProduct,
      error: null,
    };
  } catch {
    return { metrics: {}, salesByPeriod: [], salesByProduct: [], error: 'Failed to fetch analytics' };
  }
}

export async function getOrdersCsv(preset: DatePreset = 'last30days'): Promise<string> {
  const range = dateRange(preset);
  const orders = await prisma.order.findMany({
    where: { createdAt: range },
    include: { customer: true },
    orderBy: { createdAt: 'desc' },
  });
  const header = 'Order Number,Customer,Email,Total,Status,Payment,Date';
  const rows = orders.map(o =>
    [
      o.orderNumber,
      `${o.customer.firstName || ''} ${o.customer.lastName || ''}`.trim(),
      o.customer.email,
      Number(o.total).toFixed(2),
      o.status,
      o.paymentStatus,
      o.createdAt.toISOString().split('T')[0],
    ].join(',')
  );
  return [header, ...rows].join('\n');
}
