'use client';
import { useEffect, useState, useTransition } from 'react';
import { getMediaAssets, createMediaAsset, updateMediaAsset, deleteMediaAsset } from '@/lib/actions/media';
import ImageUpload from '../ImageUpload';

type MediaAsset = Awaited<ReturnType<typeof getMediaAssets>>['assets'][number];

export default function MediaLibrary() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Form
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [editAlt, setEditAlt] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    const res = await getMediaAssets(q || undefined);
    setAssets(res.assets);
    setError(res.error);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); load(); };

  const handleAdd = () => {
    setFormError(null);
    if (!title.trim()) {
      setFormError('Title is required');
      return;
    }
    if (!url.trim()) {
      setFormError('Image URL or upload file is required');
      return;
    }

    startTransition(async () => {
      const res = await createMediaAsset({ title, url, alt: alt || undefined });
      if (res.error) { setFormError(res.error); return; }
      setTitle(''); setUrl(''); setAlt('');
      await load();
    });
  };

  const handleUpdateAlt = (id: string) => {
    startTransition(async () => {
      await updateMediaAsset(id, { alt: editAlt[id] });
      await load();
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this media asset?')) return;
    startTransition(async () => { await deleteMediaAsset(id); await load(); });
  };

  return (
    <section className="adminMedia" aria-labelledby="media-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Assets</p>
          <h1 id="media-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>Media Library</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Upload image files directly or paste asset URLs with alt text and metadata.</p>
        </div>
      </div>

      {/* Add media */}
      <div className="adminPanel">
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">Upload / Add</p><h2>Add Media Asset</h2></div>
        </div>
        <div className="adminDiscountCheck" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label>Title <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Hero Editorial Pashmina" /></label>
          
          <ImageUpload
            label="Upload Image File or URL"
            value={url}
            onChange={uploadedUrl => setUrl(uploadedUrl)}
            placeholder="Select a file to upload or enter image path..."
          />

          <label>Alt text <input value={alt} onChange={e => setAlt(e.target.value)} placeholder="Descriptive alt text for SEO…" /></label>
          
          <button type="button" className="adminPrimaryButton" onClick={handleAdd} disabled={isPending}>
            {isPending ? 'Saving…' : 'Add to Media Library'}
          </button>
          {formError && <p className="adminFormMessage" style={{ color: 'var(--admin-danger)' }}>{formError}</p>}
        </div>
      </div>

      {/* Search */}
      <form className="adminProductTools" onSubmit={handleSearch}>
        <label className="adminSearch" style={{ flex: 1 }}>
          <span style={{ display: 'none' }}>Search media</span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="File name or alt text" />
        </label>
        <button type="submit" className="adminSecondaryAction">Search</button>
      </form>

      {/* Grid */}
      <div className="adminPanel">
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">Library</p><h2>All Media Assets</h2></div>
          <span>{assets.length} asset{assets.length !== 1 ? 's' : ''}</span>
        </div>
        {loading ? (
          <div className="adminEmpty"><p>Loading…</p></div>
        ) : error ? (
          <div className="adminEmpty"><p style={{ color: 'var(--admin-danger)' }}>{error}</p></div>
        ) : assets.length === 0 ? (
          <div className="adminEmpty">
            <span aria-hidden="true">○</span>
            <p><strong>No media assets</strong>Upload your first asset above using an image file or URL.</p>
          </div>
        ) : (
          <div className="adminMediaUses" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
            {assets.map(a => (
              <div key={a.id} style={{ border: '1px solid var(--admin-line)', borderRadius: '6px', overflow: 'hidden' }}>
                <img
                  src={a.url}
                  alt={a.alt || a.title}
                  style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div style={{ padding: '8px' }}>
                  <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</p>
                  <input
                    style={{ width: '100%', fontSize: '11px', marginBottom: '4px' }}
                    placeholder="Alt text…"
                    value={editAlt[a.id] ?? (a.alt || '')}
                    onChange={e => setEditAlt(m => ({ ...m, [a.id]: e.target.value }))}
                  />
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button type="button" onClick={() => handleUpdateAlt(a.id)} style={{ fontSize: '11px', flex: 1 }}>Save alt</button>
                    <button type="button" className="adminDangerButton" onClick={() => handleDelete(a.id)} style={{ fontSize: '11px' }}>✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
