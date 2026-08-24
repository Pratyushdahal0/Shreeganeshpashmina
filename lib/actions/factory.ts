'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

function nextOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  return `FO-${ts}`;
}

export async function getFactoryOrders(status?: string) {
  try {
    const orders = await prisma.factoryOrder.findMany({
      where: status ? { status: status as any } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return { orders, error: null };
  } catch {
    return { orders: [], error: 'Failed to fetch factory orders' };
  }
}

export async function createFactoryOrder(data: {
  title: string;
  productName: string;
  quantity: number;
  notes?: string;
}) {
  if (!data.title?.trim()) return { order: null, error: 'Title is required' };
  if (!data.productName?.trim()) return { order: null, error: 'Product name is required' };
  if (!data.quantity || data.quantity < 1) return { order: null, error: 'Quantity must be at least 1' };

  try {
    const order = await prisma.factoryOrder.create({
      data: {
        orderNumber: nextOrderNumber(),
        title: data.title.trim(),
        productName: data.productName.trim(),
        quantity: data.quantity,
        status: 'PLANNED',
        notes: data.notes?.trim() || null,
      },
    });
    revalidatePath('/admin/factory');
    return { order, error: null };
  } catch {
    return { order: null, error: 'Failed to create factory order' };
  }
}

export async function updateFactoryOrder(id: string, data: {
  status?: 'PLANNED' | 'IN_PRODUCTION' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}) {
  try {
    await prisma.factoryOrder.update({
      where: { id },
      data: {
        ...(data.status ? { status: data.status } : {}),
        ...(data.notes !== undefined ? { notes: data.notes } : {}),
      },
    });
    revalidatePath('/admin/factory');
    return { error: null };
  } catch {
    return { error: 'Failed to update factory order' };
  }
}

export async function deleteFactoryOrder(id: string) {
  try {
    await prisma.factoryOrder.delete({ where: { id } });
    revalidatePath('/admin/factory');
    return { error: null };
  } catch {
    return { error: 'Failed to delete factory order' };
  }
}
