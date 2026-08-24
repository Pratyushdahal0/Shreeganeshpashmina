'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getNotifications(unreadOnly = false) {
  try {
    const notifications = await prisma.notification.findMany({
      where: unreadOnly ? { isRead: false } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return { notifications, error: null };
  } catch {
    return { notifications: [], error: 'Failed to fetch notifications' };
  }
}

export async function createNotification(data: {
  title: string;
  message: string;
  type: 'ORDER' | 'PAYMENT' | 'STOCK' | 'INQUIRY' | 'REVIEW' | 'OTHER';
}) {
  try {
    await prisma.notification.create({ data });
    revalidatePath('/admin/notifications');
    return { error: null };
  } catch {
    return { error: 'Failed to create notification' };
  }
}

export async function markNotificationRead(id: string) {
  try {
    await prisma.notification.update({ where: { id }, data: { isRead: true } });
    revalidatePath('/admin/notifications');
    return { error: null };
  } catch {
    return { error: 'Failed to mark notification as read' };
  }
}

export async function markAllNotificationsRead() {
  try {
    await prisma.notification.updateMany({ where: { isRead: false }, data: { isRead: true } });
    revalidatePath('/admin/notifications');
    return { error: null };
  } catch {
    return { error: 'Failed to mark all notifications as read' };
  }
}

export async function deleteNotification(id: string) {
  try {
    await prisma.notification.delete({ where: { id } });
    revalidatePath('/admin/notifications');
    return { error: null };
  } catch {
    return { error: 'Failed to delete notification' };
  }
}
