'use server';

import prisma from '@/lib/db';
import { Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { users, error: null };
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return { users: [], error: 'Failed to fetch users' };
  }
}

export async function updateUserRole(userId: string, role: Role) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });
    revalidatePath('/admin/users');
    return { user, error: null };
  } catch (error: any) {
    console.error('Error updating user role:', error);
    return { user: null, error: 'Failed to update user role' };
  }
}

export async function deleteUser(userId: string) {
  try {
    await prisma.user.delete({ where: { id: userId } });
    revalidatePath('/admin/users');
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return { success: false, error: 'Failed to delete user' };
  }
}
