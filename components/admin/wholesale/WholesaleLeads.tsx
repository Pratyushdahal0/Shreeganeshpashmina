'use client';
import { useState } from 'react';

export default function WholesaleLeads() {
  const [query, setQuery] = useState('');

  return (
    <section className="adminWholesale" aria-labelledby="wholesale-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">B2B</p>
          <h1 id="wholesale-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>Wholesale leads</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Qualify business inquiries and prepare controlled commercial follow-up.</p>
        </div>
      </div>

      <div className="adminNotice">
        <div>
          <strong>Wholesale CRM is not connected</strong>
          <span>No wholesale company, contact, budget, quantity, communication, document, or quotation data is available.</span>
        </div>
        <span className="adminNoticeTag">No persistence</span>
      </div>

      <div className="adminProductTools">
        <label className="adminSearch" style={{ flex: 1 }}>
          <span style={{ display: 'none' }}>Search leads</span>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Company, contact, country, or product interest" />
        </label>
        <label style={{ width: '180px' }}>
          <span style={{ display: 'none' }}>Status</span>
          <select disabled><option>All statuses</option></select>
        </label>
        <label style={{ width: '180px' }}>
          <span style={{ display: 'none' }}>Assigned staff</span>
          <select disabled><option>All staff</option></select>
        </label>
      </div>

      <section className="adminWholesaleFuture">
        <strong>Prepared for future B2B operations</strong>
        <span>Wholesale pricing · MOQ · wholesale catalogue · bulk ordering · private label · custom manufacturing</span>
      </section>

      <div className="adminPanel">
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">Lead list</p><h2>All wholesale leads</h2></div>
          <span>Unavailable</span>
        </div>
        <div className="adminEmpty">
          <span aria-hidden="true">○</span>
          <p><strong>No wholesale leads available</strong>Connect a B2B CRM service to search, qualify, assign, follow up, store communication history, attach documents, and prepare non-fabricated quotations.</p>
        </div>
      </div>
    </section>
  );
}
