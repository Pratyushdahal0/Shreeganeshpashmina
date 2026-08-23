'use client';
import { useState } from 'react';

export default function WhatsAppInquiries() {
  const [query, setQuery] = useState('');

  return (
    <section className="adminWhatsApp" aria-labelledby="whatsapp-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Sales channel</p>
          <h1 id="whatsapp-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>WhatsApp inquiries</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Manage conversations from inquiry through order conversion.</p>
        </div>
      </div>

      <div className="adminNotice">
        <div>
          <strong>WhatsApp CRM is not connected</strong>
          <span>This repository only generates WhatsApp conversation links. It has no configured WhatsApp Business API or inquiry backend.</span>
        </div>
        <span className="adminNoticeTag">Integration pending</span>
      </div>

      <div className="adminProductTools">
        <label className="adminSearch" style={{ flex: 1 }}>
          <span style={{ display: 'none' }}>Search inquiries</span>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Customer, product, reference, or assigned staff" />
        </label>
        <label style={{ width: '180px' }}>
          <span style={{ display: 'none' }}>Status</span>
          <select disabled><option>All statuses</option></select>
        </label>
        <label style={{ width: '180px' }}>
          <span style={{ display: 'none' }}>Assignee</span>
          <select disabled><option>All staff</option></select>
        </label>
      </div>

      <section className="adminWhatsAppWorkflow" aria-label="WhatsApp conversion workflow">
        {['New inquiry', 'Contacted', 'Negotiating', 'Order confirmed', 'Convert to order'].map((step, index) => (
          <div key={step}><strong>{index + 1}</strong><span>{step}</span></div>
        ))}
      </section>

      <div className="adminPanel">
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">Inquiry list</p><h2>All conversations</h2></div>
          <span>Unavailable</span>
        </div>
        <div className="adminEmpty">
          <span aria-hidden="true">○</span>
          <p><strong>No WhatsApp inquiries available</strong>Connect message ingestion and an internal CRM datastore to track customers, product/variant interest, quantity, notes, follow-ups, staff assignment, and conversion.</p>
        </div>
      </div>
    </section>
  );
}
