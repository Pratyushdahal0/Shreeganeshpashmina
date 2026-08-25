import sharp from 'sharp';

export const DISPLAY_MAX_EDGE = 1600;
export const THUMB_MAX_EDGE = 480;
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const MAX_FILES_PER_UPLOAD = 12;
export const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
]);

export type ProcessedImage = {
  display: Buffer;
  thumb: Buffer;
  mimeType: 'image/webp';
  width: number;
  height: number;
  displaySize: number;
  thumbSize: number;
};

function isAllowedType(mime: string, filename: string) {
  if (ALLOWED_IMAGE_TYPES.has(mime)) return true;
  return /\.(jpe?g|png|webp|avif|gif)$/i.test(filename);
}

export function assertUploadable(file: { type: string; name: string; size: number }) {
  if (!isAllowedType(file.type, file.name)) {
    throw new Error('Only JPEG, PNG, WebP, AVIF, and GIF images are allowed');
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('Each image must be 10MB or smaller');
  }
}

export async function processImageBuffer(input: Buffer): Promise<ProcessedImage> {
  const pipeline = sharp(input, { failOn: 'none', animated: false }).rotate();
  const meta = await pipeline.metadata();

  const display = await sharp(input, { failOn: 'none' })
    .rotate()
    .resize({
      width: DISPLAY_MAX_EDGE,
      height: DISPLAY_MAX_EDGE,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 78, effort: 4 })
    .toBuffer();

  const thumb = await sharp(input, { failOn: 'none' })
    .rotate()
    .resize({
      width: THUMB_MAX_EDGE,
      height: THUMB_MAX_EDGE,
      fit: 'cover',
      position: 'attention',
      withoutEnlargement: true,
    })
    .webp({ quality: 70, effort: 4 })
    .toBuffer();

  const displayMeta = await sharp(display).metadata();

  return {
    display,
    thumb,
    mimeType: 'image/webp',
    width: displayMeta.width || meta.width || DISPLAY_MAX_EDGE,
    height: displayMeta.height || meta.height || DISPLAY_MAX_EDGE,
    displaySize: display.length,
    thumbSize: thumb.length,
  };
}

export function displayUrl(image: { url: string; thumbUrl?: string | null }) {
  return image.url;
}

export function thumbUrl(image: { url: string; thumbUrl?: string | null } | null | undefined, fallback = '/images/product-shawl.jpg') {
  if (!image) return fallback;
  return image.thumbUrl || image.url || fallback;
}
