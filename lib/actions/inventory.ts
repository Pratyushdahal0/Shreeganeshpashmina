'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getInventory() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return { products, error: null };
  } catch (error: any) {
    console.error('Error fetching inventory:', error);
    return { products: [], error: 'Failed to fetch inventory from database' };
  }
}

export async function updateInventory(variantId: string, quantity: number) {
  try {
    if (typeof quantity !== 'number' || quantity < 0) {
      return { variant: null, error: 'Inventory stock level must be a non-negative number' };
    }

    const variant = await prisma.variant.update({
      where: { id: variantId },
      data: { inventory: quantity },
    });

    revalidatePath('/admin/inventory');
    revalidatePath('/admin/products');
    revalidatePath('/admin');
    return { variant, error: null };
  } catch (error: any) {
    console.error('Error updating inventory:', error);
    return { variant: null, error: 'Failed to update inventory stock' };
  }
}
