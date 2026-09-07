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

async function uploadToCloudinary(buffer: Buffer, filename: string): Promise<string | null> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName) return null;

  try {
    const formData = new FormData();
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
    const blob = new Blob([arrayBuffer], { type: 'image/webp' });
    formData.append('file', blob, filename);

    if (uploadPreset) {
      formData.append('upload_preset', uploadPreset);
    } else if (apiKey && apiSecret) {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const crypto = await import('crypto');
      const signature = crypto
        .createHash('sha1')
        .update(`timestamp=${timestamp}${apiSecret}`)
        .digest('hex');
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
    } else {
      return null;
    }

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      console.error('Cloudinary upload status error:', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    return data.secure_url || data.url || null;
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return null;
  }
}

async function saveProcessed(file: File, uploadsDir: string): Promise<SavedFile> {
  assertUploadable({ type: file.type, name: file.name, size: file.size });

  const bytes = await file.arrayBuffer();
  const processed = await processImageBuffer(Buffer.from(bytes));

  const base = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const stem = base.replace(/\.[^.]+$/, '');
  const displayName = `${stem}.webp`;
  const thumbName = `${stem}_thumb.webp`;

  let url = `/uploads/${displayName}`;
  let thumbUrl = `/uploads/${thumbName}`;

  try {
    await mkdir(uploadsDir, { recursive: true });
    await Promise.all([
      writeFile(path.join(uploadsDir, displayName), processed.display),
      writeFile(path.join(uploadsDir, thumbName), processed.thumb),
    ]);
  } catch (fsErr: any) {
    console.warn('Local disk upload failed (read-only filesystem):', fsErr?.message);

    // 1. Try Cloudinary upload if configured
    const cloudUrl = await uploadToCloudinary(processed.display, displayName);
    const cloudThumbUrl = await uploadToCloudinary(processed.thumb, thumbName);

    if (cloudUrl) {
      url = cloudUrl;
      thumbUrl = cloudThumbUrl || cloudUrl;
    } else {
      // 2. Fallback to optimized WebP Data URL for zero-config serverless compatibility
      url = `data:image/webp;base64,${processed.display.toString('base64')}`;
      thumbUrl = `data:image/webp;base64,${processed.thumb.toString('base64')}`;
    }
  }

  return {
    url,
    thumbUrl,
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
