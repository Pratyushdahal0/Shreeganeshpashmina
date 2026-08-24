'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

// ── list ──────────────────────────────────────────────────────────────────────
export async function getDiscounts() {
  try {
    const discounts = await prisma.discount.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { discounts, error: null };
  } catch (e: any) {
    return { discounts: [], error: 'Failed to fetch discounts' };
  }
}

// ── create ────────────────────────────────────────────────────────────────────
export async function createDiscount(data: {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minimumSubtotal?: number;
  startsAt?: string;
  endsAt?: string;
}) {
  if (!data.code?.trim()) return { discount: null, error: 'Discount code is required' };
  if (!data.discountValue || data.discountValue <= 0) return { discount: null, error: 'Discount value must be > 0' };
  if (data.discountType === 'PERCENTAGE' && data.discountValue > 100) return { discount: null, error: 'Percentage cannot exceed 100' };

  try {
    const discount = await prisma.discount.create({
      data: {
        code: data.code.trim().toUpperCase(),
        discountType: data.discountType,
        discountValue: data.discountValue,
        minimumSubtotal: data.minimumSubtotal ?? null,
        startsAt: data.startsAt ? new Date(data.startsAt) : null,
        endsAt: data.endsAt ? new Date(data.endsAt) : null,
        isActive: true,
      },
    });
    revalidatePath('/admin/discounts');
    return { discount, error: null };
  } catch (e: any) {
    if (e.code === 'P2002') return { discount: null, error: 'Discount code already exists' };
    return { discount: null, error: 'Failed to create discount' };
  }
}

// ── toggle active ─────────────────────────────────────────────────────────────
export async function toggleDiscount(id: string) {
  try {
    const existing = await prisma.discount.findUnique({ where: { id } });
    if (!existing) return { error: 'Discount not found' };
    await prisma.discount.update({ where: { id }, data: { isActive: !existing.isActive } });
    revalidatePath('/admin/discounts');
    return { error: null };
  } catch {
    return { error: 'Failed to update discount' };
  }
}

// ── delete ────────────────────────────────────────────────────────────────────
export async function deleteDiscount(id: string) {
  try {
    await prisma.discount.delete({ where: { id } });
    revalidatePath('/admin/discounts');
    return { error: null };
  } catch {
    return { error: 'Failed to delete discount' };
  }
}

// ── validate code (storefront) ────────────────────────────────────────────────
export async function applyDiscountCode(code: string, subtotal: number) {
  try {
    const discount = await prisma.discount.findUnique({
      where: { code: code.trim().toUpperCase() },
    });
    if (!discount || !discount.isActive) return { valid: false, error: 'Invalid or inactive discount code', discount: null };

    const now = new Date();
    if (discount.startsAt && now < discount.startsAt) return { valid: false, error: 'Discount not yet active', discount: null };
    if (discount.endsAt && now > discount.endsAt) return { valid: false, error: 'Discount has expired', discount: null };
    if (discount.minimumSubtotal && subtotal < Number(discount.minimumSubtotal)) {
      return { valid: false, error: `Minimum order of $${discount.minimumSubtotal} required`, discount: null };
    }

    const amount = discount.discountType === 'PERCENTAGE'
      ? (subtotal * Number(discount.discountValue)) / 100
      : Math.min(subtotal, Number(discount.discountValue));

    return { valid: true, error: null, discount: { ...discount, appliedAmount: amount } };
  } catch {
    return { valid: false, error: 'Failed to validate code', discount: null };
  }
}
