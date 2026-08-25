'use client';
import { useEffect, useState, useTransition } from 'react';
import { getMediaAssets, createMediaAssets, updateMediaAsset, deleteMediaAsset } from '@/lib/actions/media';
import MultiImageUpload, { type UploadedImage } from '../MultiImageUpload';

type MediaAsset = Awaited<ReturnType<typeof getMediaAssets>>['assets'][number];

export default function MediaLibrary() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Form
  const [titlePrefix, setTitlePrefix] = useState('');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [alt, setAlt] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [editAlt, setEditAlt] = useState<Record<string, string>>({});
  
  // Selected Image Lightbox Modal
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await getMediaAssets(q || undefined);
    setAssets(res.assets);
    setError(res.error);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); load(); };

  const handleAddBatch = () => {
    setFormError(null);
    if (uploadedImages.length === 0) {
      setFormError('Please upload at least one image file first.');
      return;
    }

    startTransition(async () => {
      const items = uploadedImages.map((img, idx) => {
        const itemTitle = titlePrefix.trim()
          ? `${titlePrefix.trim()} ${idx + 1}`
          : `Media Asset ${Date.now().toString().slice(-4)}_${idx + 1}`;
        return {
          title: itemTitle,
          url: img.url,
          thumbUrl: img.thumbUrl || undefined,
          alt: alt.trim() || itemTitle,
        };
      });

      const res = await createMediaAssets(items);
      if (res.error) {
        setFormError(res.error);
        return;
      }
      setTitlePrefix('');
      setUploadedImages([]);
      setAlt('');
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
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>
            Upload multiple high-resolution photos at once with automatic WebP thumbnail generation and asset indexing.
          </p>
        </div>
      </div>

      {/* Add media */}
      <div className="adminPanel" style={{ marginTop: '20px' }}>
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">Upload / Add</p><h2>Add Multiple Media Assets</h2></div>
        </div>
        <div className="adminDiscountCheck" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label>
            Title Prefix (optional) 
            <input 
              value={titlePrefix} 
              onChange={e => setTitlePrefix(e.target.value)} 
              placeholder="e.g. Autumn Pashmina Lookbook" 
            />
          </label>
          
          <MultiImageUpload
            label="Upload Multiple Images at Once"
            value={uploadedImages}
            onChange={setUploadedImages}
          />

          <label>Alt Text / Tag line <input value={alt} onChange={e => setAlt(e.target.value)} placeholder="Descriptive alt text for SEO…" /></label>
          
          <button 
            type="button" 
            className="adminPrimaryButton" 
            onClick={handleAddBatch} 
            disabled={isPending || uploadedImages.length === 0}
            style={{ width: 'fit-content', padding: '10px 20px', fontWeight: 600 }}
          >
            {isPending ? 'Saving…' : `Save ${uploadedImages.length > 0 ? uploadedImages.length : ''} Asset(s) to Library`}
          </button>
          {formError && <p className="adminFormMessage" style={{ color: 'var(--admin-danger)' }}>{formError}</p>}
        </div>
      </div>

      {/* Search */}
      <form className="adminProductTools" onSubmit={handleSearch} style={{ marginTop: '24px' }}>
        <label className="adminSearch" style={{ flex: 1 }}>
          <span style={{ display: 'none' }}>Search media</span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by asset title or alt text..." />
        </label>
        <button type="submit" className="adminSecondaryAction">Search</button>
      </form>

      {/* Grid */}
      <div className="adminPanel" style={{ marginTop: '20px' }}>
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">Library</p><h2>All Media Assets</h2></div>
          <span>{assets.length} asset{assets.length !== 1 ? 's' : ''}</span>
        </div>
        {loading ? (
          <div className="adminEmpty"><p>Loading assets…</p></div>
        ) : error ? (
          <div className="adminEmpty"><p style={{ color: 'var(--admin-danger)' }}>{error}</p></div>
        ) : assets.length === 0 ? (
          <div className="adminEmpty">
            <span aria-hidden="true">○</span>
            <p><strong>No media assets found</strong>. Upload your first batch of images above.</p>
          </div>
        ) : (
          <div className="adminMediaUses" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
            {assets.map(a => (
              <div key={a.id} style={{ border: '1px solid var(--admin-line)', borderRadius: '6px', overflow: 'hidden', background: '#fff' }}>
                <div 
                  style={{ position: 'relative', height: '140px', background: '#f5f5f5', cursor: 'pointer', overflow: 'hidden' }}
                  onClick={() => setSelectedAsset(a)}
                  title="Click to view full photo"
                >
                  <img
                    src={a.thumbUrl || a.url}
                    alt={a.alt || a.title}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <span style={{ position: 'absolute', bottom: 4, right: 4, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '9px', padding: '2px 6px', borderRadius: '3px' }}>
                    Preview
                  </span>
                </div>
                <div style={{ padding: '10px' }}>
                  <p style={{ margin: '0 0 6px', fontWeight: 600, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</p>
                  <input
                    style={{ width: '100%', fontSize: '12px', marginBottom: '6px', padding: '4px 6px', border: '1px solid #ddd', borderRadius: '4px' }}
                    placeholder="Alt text…"
                    value={editAlt[a.id] ?? (a.alt || '')}
                    onChange={e => setEditAlt(m => ({ ...m, [a.id]: e.target.value }))}
                  />
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button type="button" onClick={() => handleUpdateAlt(a.id)} style={{ fontSize: '11px', flex: 1, padding: '4px' }}>Save Alt</button>
                    <button type="button" className="adminDangerButton" onClick={() => handleDelete(a.id)} style={{ fontSize: '11px', padding: '4px 8px' }}>✕ Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Asset Full Preview Modal */}
      {selectedAsset && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.82)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setSelectedAsset(null)}
        >
          <div 
            style={{
              position: 'relative',
              maxWidth: '85vw',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: '#111',
              borderRadius: '8px',
              overflow: 'hidden',
              padding: '16px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedAsset(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
              }}
            >
              ✕
            </button>
            <img 
              src={selectedAsset.url} 
              alt={selectedAsset.alt || selectedAsset.title}
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                display: 'block',
                borderRadius: '4px',
              }}
            />
            <div style={{ color: '#fff', marginTop: '12px', textAlign: 'center' }}>
              <strong style={{ fontSize: '15px' }}>{selectedAsset.title}</strong>
              {selectedAsset.alt && <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#ccc' }}>Alt: {selectedAsset.alt}</p>}
              <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#888' }}>URL: {selectedAsset.url}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
