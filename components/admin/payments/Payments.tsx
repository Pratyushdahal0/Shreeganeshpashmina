'use client';
import { useEffect, useState } from 'react';
import { getOrders, updatePaymentStatus } from '@/lib/actions/orders';
import { useTransition } from 'react';

type Order = Awaited<ReturnType<typeof getOrders>>['orders'][number];

const PAYMENT_STATUSES = ['UNPAID', 'PAID', 'REFUNDED'];

export default function Payments() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const load = async () => {
    setLoading(true);
    const res = await getOrders();
    setOrders(res.orders);
    setError(res.error);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = orders.filter(o => {
    const matchStatus = statusFilter === 'ALL' || o.paymentStatus === statusFilter;
    const matchQ = !q ||
      o.orderNumber.toLowerCase().includes(q.toLowerCase()) ||
      o.customer?.email?.toLowerCase().includes(q.toLowerCase());
    return matchStatus && matchQ;
  });

  const doUpdatePayment = (id: string, status: string) => {
    startTransition(async () => {
      await updatePaymentStatus(id, status as any);
      await load();
    });
  };

  return (
    <section className="adminPayments" aria-labelledby="payments-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Finance</p>
          <h1 id="payments-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>Payments</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>
            Order payment statuses tracked via database. External payment gateway integration (Khalti, eSewa, Fonepay) requires additional provider credentials.
          </p>
        </div>
      </div>

      <section className="adminIntegrationCard">
        <strong>Planned Nepal payment adapters</strong>
        <span>Khalti · eSewa · Fonepay · bank/card · bank transfer</span>
        <small>No external provider is currently integrated — payment status can be updated manually below.</small>
      </section>

      <div className="adminProductTools">
        <label className="adminSearch" style={{ flex: 1 }}>
          <span style={{ display: 'none' }}>Search payments</span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Order number or customer email" />
        </label>
        <label style={{ width: '180px' }}>
          <span style={{ display: 'none' }}>Status</span>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="ALL">All statuses</option>
            {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>

      <div className="adminPanel">
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">Payment records</p><h2>All orders with payment status</h2></div>
          <span>{filtered.length} order{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        {loading ? (
          <div className="adminEmpty"><p>Loading…</p></div>
        ) : error ? (
          <div className="adminEmpty"><p style={{ color: 'var(--admin-danger)' }}>{error}</p></div>
        ) : filtered.length === 0 ? (
          <div className="adminEmpty">
            <span aria-hidden="true">○</span>
            <p><strong>No payment records</strong>Orders and their payment statuses will appear here.</p>
          </div>
        ) : (
          <table className="adminTable" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><th>Order #</th><th>Customer</th><th>Total</th><th>Order Status</th><th>Payment Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id}>
                  <td><strong>{o.orderNumber}</strong></td>
                  <td>{o.customer?.email || '—'}</td>
                  <td>${Number(o.total).toFixed(2)}</td>
                  <td>{o.status}</td>
                  <td>
                    <select
                      value={o.paymentStatus}
                      onChange={e => doUpdatePayment(o.id, e.target.value)}
                      disabled={isPending}
                      style={{ fontSize: '12px' }}
                    >
                      {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ fontSize: '12px' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
