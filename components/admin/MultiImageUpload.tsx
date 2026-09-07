'use client';

import { useRef, useState } from 'react';

export type UploadedImage = { url: string; thumbUrl?: string | null };

interface MultiImageUploadProps {
  value: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  label?: string;
}

export default function MultiImageUpload({
  value,
  onChange,
  label = 'Product photos',
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      let data: any = {};
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        data = { error: text.slice(0, 150) || `Server error (${res.status} ${res.statusText})` };
      }

      if (!res.ok || data.error) {
        setError(data.error || `Upload failed with status ${res.status}`);
        return;
      }

      const uploaded: UploadedImage[] = (data.files || []).map((file: { url: string; thumbUrl?: string }) => ({
        url: file.url,
        thumbUrl: file.thumbUrl || null,
      }));
      onChange([...value, ...uploaded]);
    } catch (err: any) {
      setError(err?.message || 'Error uploading images');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const move = (index: number, direction: -1 | 1) => {
    const next = [...value];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
      {label && <label style={{ fontSize: '13px', fontWeight: 600 }}>{label}</label>}
      <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-muted, #666)' }}>
        Select multiple files at once. The first photo is used in shop grids; others appear in the product gallery.
      </p>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {value.map((img, index) => (
          <div
            key={`${img.url}-${index}`}
            style={{
              position: 'relative',
              width: '96px',
              height: '120px',
              borderRadius: '6px',
              overflow: 'hidden',
              border: index === 0 ? '2px solid #111' : '1px solid var(--admin-line, #ddd)',
              background: '#f4f4f4',
              flex: '0 0 auto',
            }}
          >
            <img
              src={img.thumbUrl || img.url}
              alt=""
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {index === 0 && (
              <span
                style={{
                  position: 'absolute',
                  left: 4,
                  bottom: 4,
                  background: 'rgba(0,0,0,.72)',
                  color: '#fff',
                  fontSize: '9px',
                  letterSpacing: '.08em',
                  textTransform: 'uppercase',
                  padding: '2px 5px',
                }}
              >
                Cover
              </span>
            )}
            <div style={{ position: 'absolute', top: 4, right: 4, display: 'flex', gap: 2 }}>
              <button type="button" onClick={() => move(index, -1)} title="Move left" style={iconBtn}>
                ‹
              </button>
              <button type="button" onClick={() => move(index, 1)} title="Move right" style={iconBtn}>
                ›
              </button>
              <button type="button" onClick={() => removeAt(index)} title="Remove" style={iconBtn}>
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          multiple
          onChange={handleFiles}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{
            padding: '8px 14px',
            fontSize: '13px',
            fontWeight: 500,
            background: 'var(--admin-accent, #111)',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: uploading ? 'wait' : 'pointer',
          }}
        >
          {uploading ? 'Uploading…' : 'Upload photos'}
        </button>
      </div>
      {error && <span style={{ color: 'var(--admin-danger, #e11d48)', fontSize: '12px' }}>{error}</span>}
    </div>
  );
}

const iconBtn: React.CSSProperties = {
  background: 'rgba(0,0,0,0.65)',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  width: '20px',
  height: '20px',
  fontSize: '12px',
  cursor: 'pointer',
  lineHeight: 1,
};
