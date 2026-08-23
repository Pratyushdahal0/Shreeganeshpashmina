'use client';
import { useState } from 'react';

export default function Reviews() {
  const [q, setQ] = useState('');

  return (
    <section className="adminReviews" aria-labelledby="reviews-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Storefront trust</p>
          <h1 id="reviews-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>Reviews</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Moderate customer reviews before they become visible on the storefront.</p>
        </div>
      </div>

      <div className="adminNotice">
        <div>
          <strong>Reviews are not connected</strong>
          <span>No customer, product, rating, review text, purchase-verification, or moderation data is available.</span>
        </div>
        <span className="adminNoticeTag">No persistence</span>
      </div>

      <div className="adminProductTools">
        <label className="adminSearch" style={{ flex: 1 }}>
          <span style={{ display: 'none' }}>Search reviews</span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Customer, product, or review text" />
        </label>
        <label style={{ width: '180px' }}>
          <span style={{ display: 'none' }}>Status</span>
          <select disabled><option>All statuses</option></select>
        </label>
        <label style={{ width: '180px' }}>
          <span style={{ display: 'none' }}>Rating</span>
          <select disabled><option>All ratings</option></select>
        </label>
      </div>

      <div className="adminPanel">
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">Moderation queue</p><h2>All reviews</h2></div>
          <span>Unavailable</span>
        </div>
        <div className="adminEmpty">
          <span aria-hidden="true">○</span>
          <p><strong>No reviews available</strong>Connect a review service to approve, reject, hide, or feature genuine customer reviews.</p>
        </div>
      </div>
    </section>
  );
}
