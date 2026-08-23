'use client';
import { useState } from 'react';
import type { DashboardDatePreset } from '@/lib/admin/dashboard';

const periods: { value: DashboardDatePreset; label: string }[] = [
  { value: 'today', label: 'Today' }, { value: 'yesterday', label: 'Yesterday' },
  { value: 'last7days', label: '7 days' }, { value: 'last30days', label: '30 days' },
  { value: 'last90days', label: '90 days' }, { value: 'thisYear', label: 'This year' },
];

const reports = ['Sales report', 'Orders report', 'Inventory report', 'Product performance', 'Customer report', 'Wholesale report', 'WhatsApp report'];

function Empty({ title }: { title: string }) {
  return (
    <div className="adminAnalyticsEmpty">
      <span>○</span>
      <strong>Not enough data yet</strong>
      <p>{title} will appear when its connected business data is available.</p>
    </div>
  );
}

export default function Analytics() {
  const [preset, setPreset] = useState<DashboardDatePreset>('today');

  return (
    <section className="adminAnalytics" aria-labelledby="analytics-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Analytics</p>
          <h1 id="analytics-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>Sales & reports</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Sales, customer, product, channel, and inventory performance.</p>
        </div>
      </div>

      <div className="adminNotice">
        <div>
          <strong>Business data is not connected</strong>
          <span>No orders, customers, inventory, WhatsApp, or wholesale data is available to calculate live performance.</span>
        </div>
        <span className="adminNoticeTag">No data</span>
      </div>

      <div className="adminDateBar">
        <div className="adminDatePresets">
          {periods.map(item => (
            <button type="button" key={item.value} className={preset === item.value ? 'isActive' : ''} onClick={() => setPreset(item.value)}>
              {item.label}
            </button>
          ))}
          <button type="button" onClick={() => setPreset('custom')} className={preset === 'custom' ? 'isActive' : ''}>Custom</button>
        </div>
      </div>

      <section className="adminAnalyticsMetrics">
        {['Revenue', 'Orders', 'Average order value', 'Conversion', 'New customers', 'Returning customers', 'Customer lifetime value', 'Current inventory', 'Low stock', 'Out of stock'].map(label => (
          <article key={label}>
            <p>{label}</p>
            <strong>—</strong>
            <span>Unavailable</span>
          </article>
        ))}
      </section>

      <div className="adminAnalyticsGrid">
        {['Sales by period', 'Sales by product', 'Sales by collection', 'Sales by channel', 'Stock velocity', 'Inventory movement'].map(title => (
          <section key={title} className="adminPanel">
            <div className="adminPanelHeading"><h2>{title}</h2><span>Unavailable</span></div>
            <Empty title={title} />
          </section>
        ))}
      </div>

      <section className="adminPanel">
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">Exports</p><h2>Reports</h2></div>
          <span>CSV pending</span>
        </div>
        <div className="adminReportGrid">
          {reports.map(report => (
            <button key={report} type="button" disabled>
              {report}
              <small>CSV export requires data integration</small>
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}
