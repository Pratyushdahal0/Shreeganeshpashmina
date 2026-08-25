'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getMediaAssets(query?: string, page = 1, pageSize = 40) {
  try {
    const where = query
      ? {
          OR: [
            { title: { contains: query, mode: 'insensitive' as const } },
            { alt: { contains: query, mode: 'insensitive' as const } },
          ],
        }
      : undefined;
    const take = Math.min(Math.max(pageSize, 1), 80);
    const skip = Math.max(page - 1, 0) * take;
    const [assets, total] = await prisma.$transaction([
      prisma.mediaAsset.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      prisma.mediaAsset.count({ where }),
    ]);
    return { assets, total, error: null };
  } catch {
    return { assets: [], total: 0, error: 'Failed to fetch media assets' };
  }
}

// Creates a record once an image has been uploaded externally (e.g. placed in /public/images)
export async function createMediaAsset(data: {
  title: string;
  url: string;
  thumbUrl?: string;
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
        thumbUrl: data.thumbUrl?.trim() || null,
        alt: data.alt?.trim() || null,
        mimeType: data.mimeType || 'image/webp',
        size: data.size || 0,
      },
    });
    revalidatePath('/admin/media');
    return { asset, error: null };
  } catch {
    return { asset: null, error: 'Failed to create media asset' };
  }
}

export async function createMediaAssets(
  items: Array<{
    title: string;
    url: string;
    thumbUrl?: string;
    alt?: string;
    mimeType?: string;
    size?: number;
  }>
) {
  if (!items || items.length === 0) return { assets: [], error: 'No media items provided' };

  try {
    const assets = await prisma.$transaction(
      items.map(data =>
        prisma.mediaAsset.create({
          data: {
            title: data.title.trim() || 'Untitled Media',
            url: data.url.trim(),
            thumbUrl: data.thumbUrl?.trim() || null,
            alt: data.alt?.trim() || data.title.trim() || null,
            mimeType: data.mimeType || 'image/webp',
            size: data.size || 0,
          },
        })
      )
    );
    revalidatePath('/admin/media');
    return { assets, error: null };
  } catch (err: any) {
    return { assets: [], error: 'Failed to create media assets' };
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
