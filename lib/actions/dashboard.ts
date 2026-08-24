'use server';

import prisma from '@/lib/db';

export async function getDashboardMetrics() {
  try {
    const [orders, products, customers] = await Promise.all([
      prisma.order.findMany({
        include: { customer: true, items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.findMany({
        include: { variants: true },
      }),
      prisma.customer.findMany(),
    ]);

    const totalSales = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    const orderCount = orders.length;
    const awaitingProcessing = orders.filter((o) => o.status === 'PENDING' || o.status === 'PROCESSING').length;
    const pendingPayments = orders.filter((o) => o.paymentStatus === 'UNPAID').length;
    const pendingShipments = orders.filter((o) => o.status === 'PROCESSING').length;
    const avgOrderValue = orderCount > 0 ? Math.round((totalSales / orderCount) * 100) / 100 : 0;

    let lowStockProducts = 0;
    let outOfStockProducts = 0;
    const lowStockAlerts: { productId: string; productName: string; sku: string; quantity: number }[] = [];

    for (const p of products) {
      for (const v of p.variants) {
        if (v.inventory === 0) {
          outOfStockProducts++;
          lowStockAlerts.push({
            productId: p.id,
            productName: p.title,
            sku: v.sku || 'N/A',
            quantity: 0,
          });
        } else if (v.inventory <= 5) {
          lowStockProducts++;
          lowStockAlerts.push({
            productId: p.id,
            productName: p.title,
            sku: v.sku || 'N/A',
            quantity: v.inventory,
          });
        }
      }
    }

    const recentOrders = orders.slice(0, 5).map((o) => ({
      id: o.orderNumber || o.id.slice(0, 8),
      customer: o.customer
        ? `${o.customer.firstName || ''} ${o.customer.lastName || ''}`.trim() || 'Customer'
        : 'Guest Customer',
      total: Number(o.total || 0),
      status: o.status,
      createdAt: o.createdAt.toISOString(),
    }));

    return {
      state: 'live' as const,
      updatedAt: new Date().toISOString(),
      currency: 'USD',
      kpis: {
        sales: totalSales,
        orders: orderCount,
        awaitingProcessing,
        pendingPayments,
        pendingShipments,
        lowStockProducts,
        outOfStockProducts,
        newCustomers: customers.length,
        whatsappInquiries: 0,
        wholesaleInquiries: 0,
        averageOrderValue: avgOrderValue,
      },
      revenueTrend: [
        { date: new Date().toISOString().split('T')[0], revenue: totalSales },
      ],
      salesByChannel: [
        { channel: 'Online Store', revenue: totalSales, orders: orderCount },
      ],
      recentOrders,
      lowStockAlerts,
      topProducts: products.slice(0, 5).map((p) => ({
        productId: p.id,
        name: p.title,
        unitsSold: 0,
        revenue: 0,
      })),
      whatsapp: { total: 0, open: 0, replied: 0 },
      wholesale: { total: 0, open: 0, replied: 0 },
    };
  } catch (error: any) {
    console.error('Error fetching dashboard metrics:', error);
    return {
      state: 'unavailable' as const,
      updatedAt: null,
      currency: 'USD',
      kpis: {
        sales: 0,
        orders: 0,
        awaitingProcessing: 0,
        pendingPayments: 0,
        pendingShipments: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0,
        newCustomers: 0,
        whatsappInquiries: 0,
        wholesaleInquiries: 0,
        averageOrderValue: 0,
      },
      revenueTrend: [],
      salesByChannel: [],
      recentOrders: [],
      lowStockAlerts: [],
      topProducts: [],
      whatsapp: { total: 0, open: 0, replied: 0 },
      wholesale: { total: 0, open: 0, replied: 0 },
    };
  }
}
