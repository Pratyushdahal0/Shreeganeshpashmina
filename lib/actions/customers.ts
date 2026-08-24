'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getCustomers() {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        orders: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return { customers, error: null };
  } catch (error: any) {
    console.error('Error fetching customers:', error);
    return { customers: [], error: 'Failed to fetch customers from database' };
  }
}

export async function getCustomer(id: string) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          include: {
            items: true,
          },
        },
      },
    });
    return { customer, error: null };
  } catch (error: any) {
    console.error('Error fetching customer:', error);
    return { customer: null, error: 'Failed to fetch customer details' };
  }
}

export async function createCustomer(data: {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
}) {
  try {
    if (!data.email || !data.email.includes('@')) {
      return { customer: null, error: 'Valid email address is required' };
    }

    const customer = await prisma.customer.create({
      data: {
        firstName: data.firstName?.trim() || null,
        lastName: data.lastName?.trim() || null,
        email: data.email.trim().toLowerCase(),
        phone: data.phone?.trim() || null,
      },
    });

    revalidatePath('/admin/customers');
    revalidatePath('/admin');
    return { customer, error: null };
  } catch (error: any) {
    console.error('Error creating customer:', error);
    if (error.code === 'P2002') {
      return { customer: null, error: 'A customer with this email already exists' };
    }
    return { customer: null, error: 'Failed to create customer' };
  }
}

export async function updateCustomer(
  id: string,
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  }
) {
  try {
    const existing = await prisma.customer.findUnique({ where: { id } });
    if (!existing) return { customer: null, error: 'Customer not found' };

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        firstName: data.firstName?.trim() ?? existing.firstName,
        lastName: data.lastName?.trim() ?? existing.lastName,
        email: data.email?.trim().toLowerCase() ?? existing.email,
        phone: data.phone?.trim() ?? existing.phone,
      },
    });

    revalidatePath('/admin/customers');
    revalidatePath(`/admin/customers/${id}`);
    revalidatePath('/admin');
    return { customer, error: null };
  } catch (error: any) {
    console.error('Error updating customer:', error);
    return { customer: null, error: 'Failed to update customer' };
  }
}

export async function deleteCustomer(id: string) {
  try {
    await prisma.customer.delete({ where: { id } });
    revalidatePath('/admin/customers');
    revalidatePath('/admin');
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error deleting customer:', error);
    return { success: false, error: 'Failed to delete customer' };
  }
}
