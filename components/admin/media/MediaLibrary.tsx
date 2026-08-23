'use client';
import { useState } from 'react';

export default function MediaLibrary() {
  const [q, setQ] = useState('');

  return (
    <section className="adminMedia" aria-labelledby="media-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Assets</p>
          <h1 id="media-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>Media library</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Reusable visual assets with alt text, metadata, and safe archive controls.</p>
        </div>
        <button className="adminPrimaryAction" type="button" disabled>Upload media</button>
      </div>

      <div className="adminNotice">
        <div>
          <strong>Media storage is not connected</strong>
          <span>No upload, duplicate detection, asset search, metadata update, archive, or deletion can be performed.</span>
        </div>
        <span className="adminNoticeTag">No persistence</span>
      </div>

      <div className="adminProductTools">
        <label className="adminSearch" style={{ flex: 1 }}>
          <span style={{ display: 'none' }}>Search media</span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="File name, alt text, tag, or usage" />
        </label>
        <label style={{ width: '160px' }}>
          <span style={{ display: 'none' }}>Type</span>
          <select disabled><option>All media</option></select>
        </label>
        <label style={{ width: '160px' }}>
          <span style={{ display: 'none' }}>Status</span>
          <select disabled><option>Active assets</option></select>
        </label>
      </div>

      <section className="adminMediaUses">
        {['Product images', 'Factory images', 'Brand images', 'Blog images', 'Homepage banners'].map(item => (
          <span key={item}>{item}<strong>—</strong></span>
        ))}
      </section>

      <div className="adminPanel">
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">Library</p><h2>All media</h2></div>
          <span>Unavailable</span>
        </div>
        <div className="adminEmpty">
          <span aria-hidden="true">○</span>
          <p><strong>No media assets available</strong>Connect managed storage to upload, search, filter, reuse, and safely archive media without destroying existing storefront assets.</p>
        </div>
      </div>
    </section>
  );
}
