import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const customTitle = formData.get('title') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create /public/uploads folder if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Clean filename & make unique
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${Date.now()}_${sanitizedName}`;
    const filePath = path.join(uploadsDir, filename);

    // Write file to disk
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    const assetTitle = customTitle || file.name;

    // Create entry in MediaAsset database table
    const asset = await prisma.mediaAsset.create({
      data: {
        title: assetTitle,
        url: publicUrl,
        alt: assetTitle,
        mimeType: file.type || 'image/jpeg',
        size: file.size || buffer.length,
      },
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      asset,
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: error?.message || 'Failed to upload image' }, { status: 500 });
  }
}
