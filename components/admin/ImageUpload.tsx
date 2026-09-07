'use client';
import { useRef, useState } from 'react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = 'Image',
  placeholder = '/images/sample.jpg or upload file',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      } else if (data.url) {
        onChange(data.thumbUrl ? data.url : data.url);
      }
    } catch (err: any) {
      setError(err?.message || 'Error uploading image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
      {label && <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text, #111)' }}>{label}</label>}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid var(--admin-line, #ccc)',
            borderRadius: '4px',
            fontSize: '13px',
          }}
        />
        <input
          type="file"
          ref={fileInputRef}
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          multiple
          onChange={handleFileChange}
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
            whiteSpace: 'nowrap',
          }}
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>

      {error && <span style={{ color: 'var(--admin-danger, #e11d48)', fontSize: '12px' }}>{error}</span>}

      {value && (
        <div
          style={{
            marginTop: '4px',
            position: 'relative',
            width: '120px',
            height: '100px',
            borderRadius: '4px',
            overflow: 'hidden',
            border: '1px solid var(--admin-line, #ddd)',
            background: '#f9f9f9',
          }}
        >
          <img
            src={value}
            alt="Preview"
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              background: 'rgba(0,0,0,0.6)',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Remove image"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
