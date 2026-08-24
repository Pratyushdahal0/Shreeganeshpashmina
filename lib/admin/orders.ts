import { getOrders, getOrder, updateOrderStatus, updatePaymentStatus } from '@/lib/actions/orders';
import { OrderStatus as DBOrderStatus, PaymentStatus as DBPaymentStatus } from '@prisma/client';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';
export type OrderLine = {
  id: string;
  productId: string;
  variantId: string | null;
  name: string;
  sku: string | null;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type Order = {
  id: string;
  number: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  currency: string;
  lines: OrderLine[];
  total: number;
  createdAt: string;
  updatedAt: string;
};

export type OrderMutationResult =
  | { ok: true; message: string; order?: any }
  | { ok: false; reason: string; message: string };

function transformOrder(o: any): Order {
  const statusMap: Record<string, OrderStatus> = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
  };

  const paymentMap: Record<string, PaymentStatus> = {
    UNPAID: 'pending',
    PAID: 'paid',
    REFUNDED: 'refunded',
  };

  const customerName = o.customer
    ? `${o.customer.firstName || ''} ${o.customer.lastName || ''}`.trim() || 'Customer'
    : 'Guest Customer';

  return {
    id: o.id,
    number: o.orderNumber || o.id.slice(0, 8),
    customerName,
    customerEmail: o.customer?.email || 'N/A',
    status: statusMap[o.status] || 'pending',
    paymentStatus: paymentMap[o.paymentStatus] || 'pending',
    currency: 'USD',
    lines: (o.items || []).map((item: any) => ({
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      name: item.product?.title || 'Product',
      sku: item.variant?.sku || null,
      quantity: item.quantity,
      unitPrice: Number(item.price || 0),
      total: item.quantity * Number(item.price || 0),
    })),
    total: Number(o.total || 0),
    createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: o.updatedAt ? new Date(o.updatedAt).toISOString() : new Date().toISOString(),
  };
}

export const orderService = {
  async list(query?: string): Promise<{ state: 'live' | 'unavailable'; orders: Order[] }> {
    const { orders, error } = await getOrders();
    if (error || !orders) {
      return { state: 'unavailable', orders: [] };
    }

    let result = orders.map(transformOrder);
    if (query?.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (o) =>
          o.number.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q)
      );
    }
    return { state: 'live', orders: result };
  },

  async get(id: string): Promise<Order | null> {
    const { order } = await getOrder(id);
    if (!order) return null;
    return transformOrder(order);
  },

  async updateStatus(id: string, nextStatus: OrderStatus): Promise<OrderMutationResult> {
    const map: Record<OrderStatus, DBOrderStatus> = {
      pending: DBOrderStatus.PENDING,
      processing: DBOrderStatus.PROCESSING,
      shipped: DBOrderStatus.SHIPPED,
      delivered: DBOrderStatus.DELIVERED,
      cancelled: DBOrderStatus.CANCELLED,
    };

    const dbStatus = map[nextStatus];
    if (!dbStatus) {
      return { ok: false, reason: 'invalid_status', message: 'Invalid order status' };
    }

    const { order, error } = await updateOrderStatus(id, dbStatus);
    if (error || !order) {
      return { ok: false, reason: 'error', message: error || 'Failed to update order status' };
    }
    return { ok: true, message: `Order status updated to ${nextStatus}` };
  },

  async updatePaymentStatus(id: string, nextStatus: PaymentStatus): Promise<OrderMutationResult> {
    const map: Record<PaymentStatus, DBPaymentStatus> = {
      pending: DBPaymentStatus.UNPAID,
      paid: DBPaymentStatus.PAID,
      refunded: DBPaymentStatus.REFUNDED,
    };

    const dbStatus = map[nextStatus];
    if (!dbStatus) {
      return { ok: false, reason: 'invalid_status', message: 'Invalid payment status' };
    }

    const { order, error } = await updatePaymentStatus(id, dbStatus);
    if (error || !order) {
      return { ok: false, reason: 'error', message: error || 'Failed to update payment status' };
    }
    return { ok: true, message: `Payment status updated to ${nextStatus}` };
  },
};
