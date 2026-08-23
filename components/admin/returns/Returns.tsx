'use client';
import { useState } from 'react';

export default function Returns() {
  const [q, setQ] = useState('');

  return (
    <section className="adminReturns" aria-labelledby="returns-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">After sales</p>
          <h1 id="returns-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>Returns & refunds</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Return requests linked to orders, customers, products, and payment refunds.</p>
        </div>
      </div>

      <div className="adminNotice">
        <div>
          <strong>Returns are not connected</strong>
          <span>No return requests or financial transactions are available. Refunds will require an order-linked payment record.</span>
        </div>
        <span className="adminNoticeTag">No persistence</span>
      </div>

      <div className="adminProductTools">
        <label className="adminSearch" style={{ flex: 1 }}>
          <span style={{ display: 'none' }}>Search returns</span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Return ID, order, customer, or product" />
        </label>
        <label style={{ width: '180px' }}>
          <span style={{ display: 'none' }}>Status</span>
          <select disabled><option>All statuses</option></select>
        </label>
        <label style={{ width: '180px' }}>
          <span style={{ display: 'none' }}>Refund status</span>
          <select disabled><option>All refund states</option></select>
        </label>
      </div>

      <section className="adminReturnStatuses">
        {['Requested', 'Approved', 'Rejected', 'Received', 'Refunded', 'Closed'].map(status => (
          <span key={status}>{status}<strong>—</strong></span>
        ))}
      </section>

      <div className="adminPanel">
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">Return requests</p><h2>All returns</h2></div>
          <span>Unavailable</span>
        </div>
        <div className="adminEmpty">
          <span aria-hidden="true">○</span>
          <p><strong>No return requests available</strong>Connect returns and payments to process return reasons, notes, approval, receipt, and traceable refunds.</p>
        </div>
      </div>
    </section>
  );
}
