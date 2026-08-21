'use client';

import { useState } from 'react';
import type { DashboardData, DashboardDatePreset } from '@/lib/admin/dashboard';

const presets: { value: DashboardDatePreset; label: string }[] = [
  { value: 'today', label: 'Today' }, { value: 'yesterday', label: 'Yesterday' },
  { value: 'last7days', label: 'Last 7 days' }, { value: 'last30days', label: 'Last 30 days' },
  { value: 'last90days', label: 'Last 90 days' }, { value: 'thisYear', label: 'This year' },
];

type Props = { data: DashboardData };
const unavailable = '—';

function MetricCard({ label, value, detail, priority = false }: { label: string; value: number | null; detail?: string; priority?: boolean }) {
  return <article className={`adminMetric ${priority ? 'adminMetricPriority' : ''}`}><p>{label}</p><strong>{value === null ? unavailable : value}</strong>{detail && <span>{detail}</span>}</article>;
}

function EmptyPanel({ title, description, action }: { title: string; description: string; action?: string }) {
  return <div className="adminEmpty"><span aria-hidden="true">○</span><p><strong>{title}</strong>{description}</p>{action && <span className="adminEmptyAction">{action}</span>}</div>;
}

export default function Dashboard({ data }: Props) {
  const [preset, setPreset] = useState<DashboardDatePreset>('today');
  const [showCustom, setShowCustom] = useState(false);
  const title = preset === 'today' ? 'Today' : presets.find((item) => item.value === preset)?.label ?? 'Custom range';
  const noData = data.state === 'unavailable';

  return <section className="adminDashboard" aria-labelledby="dashboard-title">
    <div className="adminDashboardIntro">
      <div><p className="adminEyebrow">Business overview</p><h1 id="dashboard-title">How is the business performing?</h1><p>Operational health and sales performance for <strong>{title.toLowerCase()}</strong>.</p></div>
      <div className="adminDataState" role="status"><span aria-hidden="true" />{noData ? 'Data source not connected' : 'Live data'}</div>
    </div>

    <div className="adminDateBar" aria-label="Dashboard date range">
      <div className="adminDatePresets">{presets.map((item) => <button type="button" key={item.value} className={preset === item.value ? 'isActive' : ''} onClick={() => { setPreset(item.value); setShowCustom(false); }}>{item.label}</button>)}<button type="button" className={preset === 'custom' ? 'isActive' : ''} onClick={() => { setPreset('custom'); setShowCustom(true); }}>Custom range</button></div>
      {showCustom && <div className="adminCustomRange"><label>From <input type="date" aria-label="From date" /></label><label>To <input type="date" aria-label="To date" /></label><button type="button">Apply</button></div>}
    </div>

    {noData && <div className="adminNotice"><div><strong>Dashboard data is unavailable</strong><span>Connect the admin API and database to begin showing live sales, orders, stock, and inquiry data.</span></div><span className="adminNoticeTag">Development setup</span></div>}

    <section className="adminMetricGrid" aria-label="Key business metrics">
      <MetricCard label={preset === 'today' ? 'Today’s sales' : `Sales · ${title}`} value={data.kpis.sales} detail="Revenue from paid orders" priority />
      <MetricCard label={preset === 'today' ? 'Orders today' : `Orders · ${title}`} value={data.kpis.orders} detail="Orders placed in this period" priority />
      <MetricCard label="Average order value" value={data.kpis.averageOrderValue} detail="Across paid orders" priority />
      <MetricCard label="New customers" value={data.kpis.newCustomers} detail="First-time purchasers" />
    </section>

    <div className="adminDashboardGrid adminDashboardGridPrimary">
      <section className="adminPanel adminRevenuePanel"><div className="adminPanelHeading"><div><p className="adminEyebrow">Revenue</p><h2>Revenue trend</h2></div><span>{noData ? 'Unavailable' : 'Revenue'}</span></div><EmptyPanel title="No revenue trend available" description="Revenue history will appear here when paid-order data is connected." /></section>
      <section className="adminPanel"><div className="adminPanelHeading"><div><p className="adminEyebrow">Sales</p><h2>Sales by channel</h2></div><span>{noData ? 'Unavailable' : ''}</span></div><EmptyPanel title="No channel data available" description="Channel attribution will appear when order sources are connected." /></section>
    </div>

    <div className="adminDashboardGrid adminDashboardGridMain">
      <section className="adminPanel adminRecentOrders"><div className="adminPanelHeading"><div><p className="adminEyebrow">Orders</p><h2>Recent orders</h2></div><button type="button" disabled>View orders</button></div><EmptyPanel title="No recent orders to show" description="Orders will appear as soon as the order service is connected." /></section>
      <aside className="adminPendingActions"><p className="adminEyebrow">Operations</p><h2>Pending actions</h2><div><MetricCard label="Awaiting processing" value={data.kpis.awaitingProcessing} /><MetricCard label="Pending payments" value={data.kpis.pendingPayments} /><MetricCard label="Pending shipments" value={data.kpis.pendingShipments} /></div><p className="adminPanelFootnote">Counts are unavailable until the order workflow is connected.</p></aside>
    </div>

    <div className="adminDashboardGrid adminDashboardGridTriple">
      <section className="adminPanel"><div className="adminPanelHeading"><div><p className="adminEyebrow">Inventory</p><h2>Low-stock alerts</h2></div><span>Unavailable</span></div><div className="adminStockSummary"><div><strong>{unavailable}</strong><span>Low stock</span></div><div><strong>{unavailable}</strong><span>Out of stock</span></div></div><EmptyPanel title="Inventory data not connected" description="Products needing attention will appear here." /></section>
      <section className="adminPanel"><div className="adminPanelHeading"><div><p className="adminEyebrow">Catalogue</p><h2>Top products</h2></div><span>Unavailable</span></div><EmptyPanel title="No product ranking available" description="Ranked products will appear from completed order lines." /></section>
      <section className="adminPanel"><div className="adminPanelHeading"><div><p className="adminEyebrow">Inquiries</p><h2>WhatsApp summary</h2></div><span>Unavailable</span></div><div className="adminInquiryRows"><div><strong>{unavailable} conversations</strong><span>{unavailable} awaiting reply</span></div><div><strong>{unavailable} replied</strong><span>For the selected period</span></div></div><p className="adminPanelFootnote">Connect the WhatsApp source to monitor customer messages.</p></section>
      <section className="adminPanel"><div className="adminPanelHeading"><div><p className="adminEyebrow">Inquiries</p><h2>Wholesale summary</h2></div><span>Unavailable</span></div><div className="adminInquiryRows"><div><strong>{unavailable} inquiries</strong><span>{unavailable} awaiting reply</span></div><div><strong>{unavailable} replied</strong><span>For the selected period</span></div></div><p className="adminPanelFootnote">Connect the wholesale lead source to monitor new opportunities.</p></section>
    </div>
  </section>;
}
