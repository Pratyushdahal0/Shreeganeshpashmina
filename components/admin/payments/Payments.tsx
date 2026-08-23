'use client';
import { useState } from 'react';

export default function Payments() {
  const [q, setQ] = useState('');

  return (
    <section className="adminPayments" aria-labelledby="payments-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Finance</p>
          <h1 id="payments-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>Payments</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Provider-neutral payment records and refund controls.</p>
        </div>
      </div>

      <div className="adminNotice">
        <div>
          <strong>Payments are not connected</strong>
          <span>No payment provider, transaction data, or refund service is configured. Raw card details are never stored in this application.</span>
        </div>
        <span className="adminNoticeTag">Integration pending</span>
      </div>

      <div className="adminProductTools">
        <label className="adminSearch" style={{ flex: 1 }}>
          <span style={{ display: 'none' }}>Search payments</span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Order, transaction reference, or payment method" />
        </label>
        <label style={{ width: '180px' }}>
          <span style={{ display: 'none' }}>Status</span>
          <select disabled><option>All statuses</option></select>
        </label>
        <label style={{ width: '180px' }}>
          <span style={{ display: 'none' }}>Method</span>
          <select disabled><option>All methods</option></select>
        </label>
      </div>

      <section className="adminIntegrationCard">
        <strong>Planned Nepal payment adapters</strong>
        <span>Khalti · eSewa · Fonepay · bank/card · bank transfer</span>
        <small>No provider is currently integrated.</small>
      </section>

      <div className="adminPanel">
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">Payment records</p><h2>All payments</h2></div>
          <span>Unavailable</span>
        </div>
        <div className="adminEmpty">
          <span aria-hidden="true">○</span>
          <p><strong>No payments available</strong>Connect a payment provider or gateway webhook to view pending, authorized, paid, failed, refunded, and partially refunded records.</p>
        </div>
      </div>
    </section>
  );
}
