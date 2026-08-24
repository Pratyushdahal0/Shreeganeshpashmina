'use server';

import prisma from '@/lib/db';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { orders, error: null };
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return { orders: [], error: 'Failed to fetch orders from database' };
  }
}

export async function getOrder(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });
    return { order, error: null };
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return { order: null, error: 'Failed to fetch order details' };
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });
    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${id}`);
    revalidatePath('/admin');
    return { order, error: null };
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return { order: null, error: 'Failed to update order status' };
  }
}

export async function updatePaymentStatus(id: string, paymentStatus: PaymentStatus) {
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { paymentStatus },
    });
    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${id}`);
    revalidatePath('/admin');
    return { order, error: null };
  } catch (error: any) {
    console.error('Error updating payment status:', error);
    return { order: null, error: 'Failed to update payment status' };
  }
}

export async function createOrder(data: {
  customerEmail: string;
  customerName?: string;
  phone?: string;
  total: number;
  items: { productId: string; variantId?: string; quantity: number; price: number }[];
}) {
  try {
    if (!data.customerEmail || !data.customerEmail.includes('@')) {
      return { order: null, error: 'Valid customer email is required' };
    }
    if (!data.items || data.items.length === 0) {
      return { order: null, error: 'Order must contain at least one item' };
    }

    // Find or create customer
    let customer = await prisma.customer.findUnique({
      where: { email: data.customerEmail.trim() },
    });

    if (!customer) {
      const nameParts = (data.customerName || 'Guest Customer').trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '';
      customer = await prisma.customer.create({
        data: {
          email: data.customerEmail.trim(),
          firstName,
          lastName,
          phone: data.phone || null,
        },
      });
    }

    const orderNumber = `SGP-${Date.now().toString().slice(-6)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        total: data.total,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        customer: true,
        items: true,
      },
    });

    revalidatePath('/admin/orders');
    revalidatePath('/admin');
    return { order, error: null };
  } catch (error: any) {
    console.error('Error creating order:', error);
    return { order: null, error: 'Failed to create order' };
  }
}
