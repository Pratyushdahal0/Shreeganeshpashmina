'use client';

import { useState } from 'react';

export default function Orders() {
  const [query, setQuery] = useState('');

  return (
    <section className="adminOrders" aria-labelledby="orders-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Commerce</p>
          <h1 id="orders-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 600 }}>Orders</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Orders, payment, fulfillment, and customer service in one controlled workflow.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="adminSecondaryAction" type="button" disabled style={{ borderRadius: 'var(--radius-md)', padding: '8px 16px' }}>Export</button>
          <button className="adminPrimaryAction" type="button" disabled style={{ borderRadius: 'var(--radius-md)', padding: '8px 16px' }}>Create order</button>
        </div>
      </div>

      <div className="adminNotice" style={{ margin: '8px 0', borderRadius: 'var(--radius-md)' }}>
        <div>
          <strong>Order data is not connected</strong>
          <span>No orders, payments, fulfilment states, customer details, or timelines are available. No lifecycle change can be recorded.</span>
        </div>
        <span className="adminNoticeTag">No persistence</span>
      </div>

      <div className="adminProductTools" style={{ display: 'flex', gap: '16px', padding: '16px', background: 'var(--admin-panel)', borderRadius: 'var(--radius-md)', border: '1px solid var(--admin-line)' }}>
        <label className="adminSearch" style={{ flex: 1, margin: 0 }}>
          <span style={{ display: 'none' }}>Search orders</span>
          <input 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
            placeholder="Order number, customer, email, or reference"
            style={{ width: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--admin-line)' }}
          />
        </label>
        <label style={{ margin: 0, width: '200px' }}>
          <span style={{ display: 'none' }}>Status</span>
          <select disabled style={{ width: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--admin-line)' }}>
            <option>All statuses</option>
          </select>
        </label>
        <label style={{ margin: 0, width: '200px' }}>
          <span style={{ display: 'none' }}>Source</span>
          <select disabled style={{ width: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--admin-line)' }}>
            <option>All sources</option>
          </select>
        </label>
      </div>

      <div className="adminProductTableWrap" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', background: 'var(--admin-panel)' }}>
        <table className="adminTable">
          <thead style={{ background: 'var(--admin-bg)' }}>
            <tr>
              <th style={{ width: '40px', padding: '12px' }}><input type="checkbox" disabled /></th>
              <th>Order</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Payment status</th>
              <th>Fulfillment status</th>
            </tr>
          </thead>
          <tbody>
            {/* Empty state handles rendering */}
          </tbody>
        </table>
        
        <div className="adminEmpty" style={{ background: 'var(--admin-panel)', borderTop: '1px solid var(--admin-line)' }}>
          <span aria-hidden="true" style={{ fontSize: '32px', color: 'var(--admin-line)' }}>○</span>
          <p style={{ marginTop: '16px' }}><strong>No orders available</strong></p>
          <p>Connect an order service to search, filter, sort, inspect lines and totals, and progress valid order lifecycle states.</p>
        </div>
      </div>
    </section>
  );
}
