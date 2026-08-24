'use client';
import { useEffect, useState, useTransition } from 'react';
import {
  getDiscounts,
  createDiscount,
  toggleDiscount,
  deleteDiscount,
} from '@/lib/actions/discounts';

type Discount = Awaited<ReturnType<typeof getDiscounts>>['discounts'][number];

const TYPES = [
  { value: 'PERCENTAGE', label: 'Percentage (%)' },
  { value: 'FIXED', label: 'Fixed ($)' },
];

export default function Discounts() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Form state
  const [code, setCode] = useState('');
  const [type, setType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [value, setValue] = useState('');
  const [minSpend, setMinSpend] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await getDiscounts();
    setDiscounts(res.discounts);
    setError(res.error);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = () => {
    setFormError(null);
    setFormSuccess(null);
    startTransition(async () => {
      const res = await createDiscount({
        code,
        discountType: type,
        discountValue: Number(value),
        minimumSubtotal: minSpend ? Number(minSpend) : undefined,
        startsAt: startsAt || undefined,
        endsAt: endsAt || undefined,
      });
      if (res.error) { setFormError(res.error); return; }
      setFormSuccess('Discount created successfully');
      setCode(''); setValue(''); setMinSpend(''); setStartsAt(''); setEndsAt('');
      await load();
    });
  };

  const handleToggle = (id: string) => {
    startTransition(async () => {
      await toggleDiscount(id);
      await load();
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this discount?')) return;
    startTransition(async () => {
      await deleteDiscount(id);
      await load();
    });
  };

  return (
    <section className="adminDiscounts" aria-labelledby="discounts-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Commerce</p>
          <h1 id="discounts-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>Discounts</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Promotions with controlled scope, dates, limits, and eligibility.</p>
        </div>
      </div>

      {/* Create form */}
      <div className="adminPanel">
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">New promotion</p><h2>Create discount</h2></div>
        </div>
        <div className="adminDiscountCheck">
          <label>
            Code
            <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="e.g. SAVE20" />
          </label>
          <label>
            Type
            <select value={type} onChange={e => setType(e.target.value as any)}>
              {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </label>
          <label>
            Value
            <input type="number" min="0" value={value} onChange={e => setValue(e.target.value)} placeholder={type === 'PERCENTAGE' ? '% off' : 'Amount off'} />
          </label>
          <label>
            Min spend ($)
            <input type="number" min="0" value={minSpend} onChange={e => setMinSpend(e.target.value)} placeholder="Optional" />
          </label>
          <label>
            Starts at
            <input type="date" value={startsAt} onChange={e => setStartsAt(e.target.value)} />
          </label>
          <label>
            Ends at
            <input type="date" value={endsAt} onChange={e => setEndsAt(e.target.value)} />
          </label>
          <button type="button" className="adminPrimaryButton" onClick={handleCreate} disabled={isPending}>
            {isPending ? 'Saving…' : 'Create discount'}
          </button>
          {formError && <p className="adminFormMessage" style={{ color: 'var(--admin-danger)' }}>{formError}</p>}
          {formSuccess && <p className="adminFormMessage">{formSuccess}</p>}
        </div>
      </div>

      {/* List */}
      <div className="adminPanel">
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">Promotions</p><h2>All discounts</h2></div>
          <span>{discounts.length} discount{discounts.length !== 1 ? 's' : ''}</span>
        </div>
        {loading ? (
          <div className="adminEmpty"><p>Loading…</p></div>
        ) : error ? (
          <div className="adminEmpty"><p style={{ color: 'var(--admin-danger)' }}>{error}</p></div>
        ) : discounts.length === 0 ? (
          <div className="adminEmpty">
            <span aria-hidden="true">○</span>
            <p><strong>No discounts yet</strong>Create your first discount code above.</p>
          </div>
        ) : (
          <table className="adminTable" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Code</th><th>Type</th><th>Value</th><th>Min spend</th><th>Expires</th><th>Uses</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map(d => (
                <tr key={d.id}>
                  <td><strong>{d.code}</strong></td>
                  <td>{d.discountType}</td>
                  <td>{d.discountType === 'PERCENTAGE' ? `${d.discountValue}%` : `$${d.discountValue}`}</td>
                  <td>{d.minimumSubtotal ? `$${d.minimumSubtotal}` : '—'}</td>
                  <td>{d.endsAt ? new Date(d.endsAt).toLocaleDateString() : '—'}</td>
                  <td>{d.usageCount}</td>
                  <td>
                    <button type="button" onClick={() => handleToggle(d.id)} style={{ fontSize: '12px' }}>
                      {d.isActive ? '✔ Active' : '✗ Disabled'}
                    </button>
                  </td>
                  <td>
                    <button type="button" onClick={() => handleDelete(d.id)} className="adminDangerButton" style={{ fontSize: '12px' }}>Delete</button>
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
