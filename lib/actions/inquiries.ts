'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createNotification } from './notifications';

// ── submit (storefront / contact forms) ───────────────────────────────────────
export async function submitInquiry(data: {
  type: 'WHATSAPP' | 'WHOLESALE';
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  companyName?: string;
  estimatedQuantity?: number;
  message: string;
}) {
  if (!data.customerName?.trim()) return { error: 'Name is required' };
  if (!data.message?.trim()) return { error: 'Message is required' };
  if (data.type === 'WHOLESALE' && !data.companyName?.trim()) return { error: 'Company name is required for wholesale inquiries' };

  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        type: data.type,
        customerName: data.customerName.trim(),
        customerEmail: data.customerEmail?.trim() || null,
        customerPhone: data.customerPhone?.trim() || null,
        companyName: data.companyName?.trim() || null,
        estimatedQuantity: data.estimatedQuantity ?? null,
        message: data.message.trim(),
        status: 'OPEN',
      },
    });

    // Auto-create admin notification
    await createNotification({
      title: `New ${data.type === 'WHOLESALE' ? 'Wholesale' : 'WhatsApp'} Inquiry`,
      message: `${data.customerName}${data.companyName ? ` (${data.companyName})` : ''} sent an inquiry.`,
      type: 'INQUIRY',
    });

    return { error: null };
  } catch {
    return { error: 'Failed to submit inquiry' };
  }
}

// ── list (admin) ──────────────────────────────────────────────────────────────
export async function getInquiries(type?: 'WHATSAPP' | 'WHOLESALE', status?: string) {
  try {
    const inquiries = await prisma.inquiry.findMany({
      where: {
        ...(type ? { type } : {}),
        ...(status ? { status: status as any } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
    return { inquiries, error: null };
  } catch {
    return { inquiries: [], error: 'Failed to fetch inquiries' };
  }
}

// ── update status / notes (admin) ─────────────────────────────────────────────
export async function updateInquiry(id: string, data: { status?: string; notes?: string }) {
  try {
    await prisma.inquiry.update({
      where: { id },
      data: {
        ...(data.status ? { status: data.status as any } : {}),
        ...(data.notes !== undefined ? { notes: data.notes } : {}),
      },
    });
    revalidatePath('/admin/whatsapp');
    revalidatePath('/admin/wholesale');
    return { error: null };
  } catch {
    return { error: 'Failed to update inquiry' };
  }
}

export async function deleteInquiry(id: string) {
  try {
    await prisma.inquiry.delete({ where: { id } });
    revalidatePath('/admin/whatsapp');
    revalidatePath('/admin/wholesale');
    return { error: null };
  } catch {
    return { error: 'Failed to delete inquiry' };
  }
}
