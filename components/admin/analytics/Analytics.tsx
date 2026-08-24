'use client';
import { useEffect, useState, useTransition } from 'react';
import { getSalesAnalytics, getOrdersCsv, type DatePreset } from '@/lib/actions/analytics';

type AnalyticsData = Awaited<ReturnType<typeof getSalesAnalytics>>;

const periods: { value: DatePreset; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last7days', label: '7 days' },
  { value: 'last30days', label: '30 days' },
  { value: 'last90days', label: '90 days' },
  { value: 'thisYear', label: 'This year' },
];

function downloadCsv(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function Analytics() {
  const [preset, setPreset] = useState<DatePreset>('last30days');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const load = async (p: DatePreset) => {
    setLoading(true);
    const res = await getSalesAnalytics(p);
    setData(res);
    setError(res.error);
    setLoading(false);
  };

  useEffect(() => { load(preset); }, [preset]);

  const handleExport = (type: 'orders') => {
    startTransition(async () => {
      if (type === 'orders') {
        const csv = await getOrdersCsv(preset);
        downloadCsv(csv, `orders-${preset}.csv`);
      }
    });
  };

  const metrics = data?.metrics || {};

  return (
    <section className="adminAnalytics" aria-labelledby="analytics-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Analytics</p>
          <h1 id="analytics-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>Sales & reports</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Sales, customer, product, channel, and inventory performance.</p>
        </div>
      </div>

      {/* Date range picker */}
      <div className="adminDateBar">
        <div className="adminDatePresets">
          {periods.map(item => (
            <button
              type="button"
              key={item.value}
              className={preset === item.value ? 'isActive' : ''}
              onClick={() => setPreset(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI metrics */}
      <section className="adminAnalyticsMetrics">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <article key={i}><p>Loading…</p><strong>—</strong></article>
          ))
        ) : (
          Object.values(metrics).map((m: any) => (
            <article key={m.label}>
              <p>{m.label}</p>
              <strong>
                {m.value === null ? '—' :
                  m.label.toLowerCase().includes('revenue') || m.label.toLowerCase().includes('value')
                    ? `$${Number(m.value).toFixed(2)}`
                    : m.value
                }
              </strong>
              <span>{m.change !== null ? `${m.change > 0 ? '+' : ''}${m.change}%` : ''}</span>
            </article>
          ))
        )}
      </section>

      {/* Sales by period chart (simple text table) */}
      <div className="adminAnalyticsGrid">
        <section className="adminPanel">
          <div className="adminPanelHeading"><h2>Sales by period</h2></div>
          {loading ? <div className="adminEmpty"><p>Loading…</p></div> :
            !data?.salesByPeriod?.length ? (
              <div className="adminAnalyticsEmpty"><span>○</span><strong>Not enough data yet</strong><p>Orders will appear here.</p></div>
            ) : (
              <table className="adminTable" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr><th>Date</th><th>Revenue ($)</th></tr></thead>
                <tbody>
                  {data.salesByPeriod.map(p => (
                    <tr key={p.date}><td>{p.date}</td><td>${p.value.toFixed(2)}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
        </section>

        <section className="adminPanel">
          <div className="adminPanelHeading"><h2>Top products by sales</h2></div>
          {loading ? <div className="adminEmpty"><p>Loading…</p></div> :
            !data?.salesByProduct?.length ? (
              <div className="adminAnalyticsEmpty"><span>○</span><strong>Not enough data yet</strong><p>Product sales will appear here.</p></div>
            ) : (
              <table className="adminTable" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr><th>Product</th><th>Revenue ($)</th></tr></thead>
                <tbody>
                  {data.salesByProduct.map(p => (
                    <tr key={p.date}><td>{p.date}</td><td>${p.value.toFixed(2)}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
        </section>
      </div>

      {/* Exports */}
      <section className="adminPanel">
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">Exports</p><h2>Reports</h2></div>
        </div>
        <div className="adminReportGrid">
          <button type="button" onClick={() => handleExport('orders')} disabled={isPending}>
            Orders report
            <small>CSV export — {preset}</small>
          </button>
        </div>
        {error && <p style={{ color: 'var(--admin-danger)', fontSize: '13px', padding: '8px' }}>{error}</p>}
      </section>
    </section>
  );
}
