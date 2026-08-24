'use client';
import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import {
  getFactoryOrders,
  createFactoryOrder,
  updateFactoryOrder,
  deleteFactoryOrder,
} from '@/lib/actions/factory';

type FactoryOrder = Awaited<ReturnType<typeof getFactoryOrders>>['orders'][number];

const STATUSES = ['PLANNED', 'IN_PRODUCTION', 'COMPLETED', 'CANCELLED'];

export default function Factory() {
  const [orders, setOrders] = useState<FactoryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Create form
  const [title, setTitle] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await getFactoryOrders(statusFilter === 'ALL' ? undefined : statusFilter);
    setOrders(res.orders);
    setError(res.error);
    setLoading(false);
  };

  useEffect(() => { load(); }, [statusFilter]);

  const handleCreate = () => {
    setFormError(null);
    startTransition(async () => {
      const res = await createFactoryOrder({ title, productName, quantity: Number(quantity), notes: notes || undefined });
      if (res.error) { setFormError(res.error); return; }
      setTitle(''); setProductName(''); setQuantity('1'); setNotes('');
      await load();
    });
  };

  const handleStatus = (id: string, status: string) => {
    startTransition(async () => { await updateFactoryOrder(id, { status: status as any }); await load(); });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this production order?')) return;
    startTransition(async () => { await deleteFactoryOrder(id); await load(); });
  };

  return (
    <section className="adminFactory" aria-labelledby="factory-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Manufacturing</p>
          <h1 id="factory-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>Factory overview</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Production orders tracked from planning to completion.</p>
        </div>
      </div>

      {/* Stage pills */}
      <section className="adminFactoryStages">
        {STATUSES.map(s => (
          <span key={s}>{s.replace('_', ' ')}<strong>—</strong></span>
        ))}
      </section>

      {/* Create order */}
      <div className="adminPanel">
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">Production</p><h2>New production order</h2></div>
        </div>
        <div className="adminDiscountCheck">
          <label>Title<input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Spring Shawl Batch #1" /></label>
          <label>Product name<input value={productName} onChange={e => setProductName(e.target.value)} placeholder="e.g. Heritage Burgundy Shawl" /></label>
          <label>Quantity<input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} /></label>
          <label>Notes<input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional production notes" /></label>
          <button type="button" className="adminPrimaryButton" onClick={handleCreate} disabled={isPending}>
            {isPending ? 'Saving…' : 'Create order'}
          </button>
          {formError && <p className="adminFormMessage" style={{ color: 'var(--admin-danger)' }}>{formError}</p>}
        </div>
      </div>

      {/* Orders list */}
      <div className="adminPanel">
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">Production</p><h2>All production orders</h2></div>
          <label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ fontSize: '13px' }}>
              <option value="ALL">All statuses</option>
              {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
          </label>
        </div>
        {loading ? (
          <div className="adminEmpty"><p>Loading…</p></div>
        ) : error ? (
          <div className="adminEmpty"><p style={{ color: 'var(--admin-danger)' }}>{error}</p></div>
        ) : orders.length === 0 ? (
          <div className="adminEmpty">
            <span aria-hidden="true">○</span>
            <p><strong>No production orders</strong>Create your first production order above.</p>
          </div>
        ) : (
          <table className="adminTable" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><th>Order #</th><th>Title</th><th>Product</th><th>Qty</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td><code>{o.orderNumber}</code></td>
                  <td>{o.title}</td>
                  <td>{o.productName}</td>
                  <td>{o.quantity}</td>
                  <td>
                    <select value={o.status} onChange={e => handleStatus(o.id, e.target.value)} style={{ fontSize: '12px' }}>
                      {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                    </select>
                  </td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button type="button" className="adminDangerButton" onClick={() => handleDelete(o.id)} style={{ fontSize: '12px' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export function FactoryList({ title, text }: { title: string; text: string }) {
  return (
    <section className="adminFactory" aria-labelledby="factory-list-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Factory</p>
          <h1 id="factory-list-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>{title}</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>{text}</p>
        </div>
        <Link href="/admin/factory" className="adminSecondaryAction">Back to factory</Link>
      </div>
      <div className="adminPanel">
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">{title}</p><h2>All records</h2></div>
        </div>
        <div className="adminEmpty">
          <span aria-hidden="true">○</span>
          <p><strong>Manage from factory overview</strong>Use the Factory Overview page to create and track production orders.</p>
        </div>
      </div>
    </section>
  );
}
