import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import prisma from '@/lib/db';
import {
  assertUploadable,
  MAX_FILES_PER_UPLOAD,
  processImageBuffer,
} from '@/lib/process-image';

export const runtime = 'nodejs';

type SavedFile = {
  url: string;
  thumbUrl: string;
  mimeType: string;
  size: number;
  width: number;
  height: number;
};

async function saveProcessed(file: File, uploadsDir: string): Promise<SavedFile> {
  assertUploadable({ type: file.type, name: file.name, size: file.size });

  const bytes = await file.arrayBuffer();
  const processed = await processImageBuffer(Buffer.from(bytes));

  const base = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const stem = base.replace(/\.[^.]+$/, '');
  const displayName = `${stem}.webp`;
  const thumbName = `${stem}_thumb.webp`;

  await Promise.all([
    writeFile(path.join(uploadsDir, displayName), processed.display),
    writeFile(path.join(uploadsDir, thumbName), processed.thumb),
  ]);

  return {
    url: `/uploads/${displayName}`,
    thumbUrl: `/uploads/${thumbName}`,
    mimeType: processed.mimeType,
    size: processed.displaySize,
    width: processed.width,
    height: processed.height,
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const customTitle = (formData.get('title') as string | null) || null;

    const files = [
      ...formData.getAll('files'),
      ...formData.getAll('file'),
    ].filter((item): item is File => item instanceof File && item.size > 0);

    if (files.length === 0) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (files.length > MAX_FILES_PER_UPLOAD) {
      return NextResponse.json(
        { error: `You can upload at most ${MAX_FILES_PER_UPLOAD} images at once` },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const saved: SavedFile[] = [];
    for (const file of files) {
      saved.push(await saveProcessed(file, uploadsDir));
    }

    const assets = await prisma.$transaction(
      saved.map((item, index) =>
        prisma.mediaAsset.create({
          data: {
            title: customTitle || files[index].name,
            url: item.url,
            thumbUrl: item.thumbUrl,
            alt: customTitle || files[index].name,
            mimeType: item.mimeType,
            size: item.size,
          },
        })
      )
    );

    const filesOut = saved.map((item, index) => ({
      ...item,
      asset: assets[index],
    }));

    return NextResponse.json({
      success: true,
      url: filesOut[0].url,
      thumbUrl: filesOut[0].thumbUrl,
      asset: filesOut[0].asset,
      files: filesOut,
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: error?.message || 'Failed to upload image' }, { status: 500 });
  }
}
