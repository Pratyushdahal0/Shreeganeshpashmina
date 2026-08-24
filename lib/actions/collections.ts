'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getCollections() {
  try {
    const collections = await prisma.category.findMany({
      include: {
        products: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return { collections, error: null };
  } catch (error: any) {
    console.error('Error fetching collections:', error);
    return { collections: [], error: 'Failed to fetch collections from database' };
  }
}

export async function getCollection(id: string) {
  try {
    const collection = await prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
    return { collection, error: null };
  } catch (error: any) {
    console.error('Error fetching collection:', error);
    return { collection: null, error: 'Failed to fetch collection' };
  }
}

export async function createCollection(data: { name: string; slug?: string; description?: string }) {
  try {
    if (!data.name || !data.name.trim()) {
      return { collection: null, error: 'Collection/Category name is required' };
    }

    const name = data.name.trim();
    const slug = data.slug?.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const collection = await prisma.category.create({
      data: {
        name,
        slug,
        description: data.description || '',
      },
    });

    revalidatePath('/admin/collections');
    revalidatePath('/admin/products');
    revalidatePath('/admin');
    return { collection, error: null };
  } catch (error: any) {
    console.error('Error creating collection:', error);
    if (error.code === 'P2002') {
      return { collection: null, error: 'A collection with this slug already exists' };
    }
    return { collection: null, error: 'Failed to create collection' };
  }
}

export async function updateCollection(id: string, data: { name?: string; slug?: string; description?: string }) {
  try {
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) return { collection: null, error: 'Collection not found' };

    const name = data.name?.trim() ?? existing.name;
    const slug = data.slug?.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') ?? existing.slug;

    const collection = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description: data.description ?? existing.description,
      },
    });

    revalidatePath('/admin/collections');
    revalidatePath(`/admin/collections/${id}`);
    revalidatePath('/admin');
    return { collection, error: null };
  } catch (error: any) {
    console.error('Error updating collection:', error);
    return { collection: null, error: 'Failed to update collection' };
  }
}

export async function deleteCollection(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    });
    revalidatePath('/admin/collections');
    revalidatePath('/admin');
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error deleting collection:', error);
    return { success: false, error: 'Failed to delete collection' };
  }
}
