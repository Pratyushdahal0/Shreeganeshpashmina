'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createNotification } from './notifications';

// ── list (admin) ──────────────────────────────────────────────────────────────
export async function getReviews(status?: 'PENDING' | 'APPROVED' | 'REJECTED') {
  try {
    const reviews = await prisma.review.findMany({
      where: status ? { status } : undefined,
      include: { product: { select: { id: true, title: true, handle: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return { reviews, error: null };
  } catch {
    return { reviews: [], error: 'Failed to fetch reviews' };
  }
}

// ── get by product (storefront) ───────────────────────────────────────────────
export async function getApprovedReviews(productId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId, status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
    });
    return { reviews, error: null };
  } catch {
    return { reviews: [], error: 'Failed to fetch reviews' };
  }
}

// ── submit (storefront) ───────────────────────────────────────────────────────
export async function submitReview(data: {
  productId: string;
  authorName: string;
  authorEmail: string;
  rating: number;
  comment: string;
}) {
  if (!data.productId) return { error: 'Product ID is required' };
  if (!data.authorName?.trim()) return { error: 'Your name is required' };
  if (!data.authorEmail?.trim() || !data.authorEmail.includes('@')) return { error: 'Valid email is required' };
  if (!data.rating || data.rating < 1 || data.rating > 5) return { error: 'Rating must be between 1 and 5' };
  if (!data.comment?.trim()) return { error: 'Review comment is required' };

  try {
    const product = await prisma.product.findUnique({ where: { id: data.productId } });
    if (!product) return { error: 'Product not found' };

    await prisma.review.create({
      data: {
        productId: data.productId,
        authorName: data.authorName.trim(),
        authorEmail: data.authorEmail.trim().toLowerCase(),
        rating: data.rating,
        comment: data.comment.trim(),
        status: 'PENDING',
      },
    });

    // Auto-create admin notification
    await createNotification({
      title: 'New Customer Review Pending',
      message: `${data.authorName} left a ${data.rating}-star review for "${product.title}".`,
      type: 'REVIEW',
    });

    return { error: null };
  } catch {
    return { error: 'Failed to submit review' };
  }
}

// ── moderate (admin) ──────────────────────────────────────────────────────────
export async function moderateReview(id: string, status: 'APPROVED' | 'REJECTED') {
  try {
    const review = await prisma.review.update({
      where: { id },
      data: { status },
      include: { product: true },
    });
    revalidatePath('/admin/reviews');
    if (review.product?.handle) {
      revalidatePath(`/product/${review.product.handle}`);
    }
    return { error: null };
  } catch {
    return { error: 'Failed to update review' };
  }
}

export async function deleteReview(id: string) {
  try {
    const review = await prisma.review.findUnique({ where: { id }, include: { product: true } });
    await prisma.review.delete({ where: { id } });
    revalidatePath('/admin/reviews');
    if (review?.product?.handle) {
      revalidatePath(`/product/${review.product.handle}`);
    }
    return { error: null };
  } catch {
    return { error: 'Failed to delete review' };
  }
}
