'use client';
import { useState } from 'react';

export default function Customers() {
  const [query, setQuery] = useState('');

  return (
    <section className="adminCustomers" aria-labelledby="customers-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Commerce</p>
          <h1 id="customers-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>Customers</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Customer profiles, order history, segments, and internal notes.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="adminSecondaryAction" type="button" disabled>Export</button>
          <button className="adminPrimaryAction" type="button" disabled>Add customer</button>
        </div>
      </div>

      <div className="adminNotice">
        <div>
          <strong>Customer data is not connected</strong>
          <span>No customer records, personal contact information, addresses, spending, or order history are available to display.</span>
        </div>
        <span className="adminNoticeTag">No persistence</span>
      </div>

      <div className="adminProductTools">
        <label className="adminSearch" style={{ flex: 1 }}>
          <span style={{ display: 'none' }}>Search customers</span>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name, email, phone, or tag..." />
        </label>
      </div>

      <section className="adminCustomerSegments">
        {['New', 'Returning', 'High Value', 'Inactive', 'Wholesale', 'WhatsApp'].map(segment => (
          <span key={segment}>{segment}<strong>—</strong></span>
        ))}
      </section>

      <div className="adminPanel">
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">Customer directory</p><h2>All customers</h2></div>
          <span>Unavailable</span>
        </div>
        <div className="adminEmpty">
          <span aria-hidden="true">○</span>
          <p><strong>No customers available</strong>Connect customer and order data to search profiles and calculate customer segments without exposing unnecessary personal information.</p>
        </div>
      </div>
    </section>
  );
}
