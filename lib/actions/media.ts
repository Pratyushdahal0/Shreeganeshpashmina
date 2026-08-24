'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getMediaAssets(query?: string) {
  try {
    const assets = await prisma.mediaAsset.findMany({
      where: query ? {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { alt: { contains: query, mode: 'insensitive' } },
        ],
      } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return { assets, error: null };
  } catch {
    return { assets: [], error: 'Failed to fetch media assets' };
  }
}

// Creates a record once an image has been uploaded externally (e.g. placed in /public/images)
export async function createMediaAsset(data: {
  title: string;
  url: string;
  alt?: string;
  mimeType?: string;
  size?: number;
}) {
  if (!data.title?.trim()) return { asset: null, error: 'Title is required' };
  if (!data.url?.trim()) return { asset: null, error: 'URL is required' };

  try {
    const asset = await prisma.mediaAsset.create({
      data: {
        title: data.title.trim(),
        url: data.url.trim(),
        alt: data.alt?.trim() || null,
        mimeType: data.mimeType || 'image/jpeg',
        size: data.size || 0,
      },
    });
    revalidatePath('/admin/media');
    return { asset, error: null };
  } catch {
    return { asset: null, error: 'Failed to create media asset' };
  }
}

export async function updateMediaAsset(id: string, data: { title?: string; alt?: string }) {
  try {
    await prisma.mediaAsset.update({
      where: { id },
      data: {
        ...(data.title ? { title: data.title.trim() } : {}),
        ...(data.alt !== undefined ? { alt: data.alt.trim() } : {}),
      },
    });
    revalidatePath('/admin/media');
    return { error: null };
  } catch {
    return { error: 'Failed to update asset' };
  }
}

export async function deleteMediaAsset(id: string) {
  try {
    await prisma.mediaAsset.delete({ where: { id } });
    revalidatePath('/admin/media');
    return { error: null };
  } catch {
    return { error: 'Failed to delete asset' };
  }
}
