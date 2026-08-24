'use client';
import { useEffect, useState, useTransition } from 'react';
import { getInquiries, updateInquiry, deleteInquiry } from '@/lib/actions/inquiries';

type Inquiry = Awaited<ReturnType<typeof getInquiries>>['inquiries'][number];

const STATUSES = ['OPEN', 'REPLIED', 'CLOSED'];

export default function WholesaleLeads() {
  const [leads, setLeads] = useState<Inquiry[]>([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    const res = await getInquiries('WHOLESALE', statusFilter === 'ALL' ? undefined : statusFilter);
    setLeads(res.inquiries);
    setError(res.error);
    setLoading(false);
  };

  useEffect(() => { load(); }, [statusFilter]);

  const filtered = leads.filter(i =>
    !query ||
    i.customerName.toLowerCase().includes(query.toLowerCase()) ||
    i.companyName?.toLowerCase().includes(query.toLowerCase()) ||
    i.message.toLowerCase().includes(query.toLowerCase())
  );

  const doStatus = (id: string, status: string) => {
    startTransition(async () => { await updateInquiry(id, { status }); await load(); });
  };

  const doNotes = (id: string) => {
    startTransition(async () => { await updateInquiry(id, { notes: notesMap[id] || '' }); await load(); });
  };

  const doDelete = (id: string) => {
    if (!confirm('Delete this wholesale lead?')) return;
    startTransition(async () => { await deleteInquiry(id); await load(); });
  };

  return (
    <section className="adminWholesale" aria-labelledby="wholesale-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">B2B</p>
          <h1 id="wholesale-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>Wholesale leads</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Qualify business inquiries and prepare controlled commercial follow-up.</p>
        </div>
      </div>

      <div className="adminProductTools">
        <label className="adminSearch" style={{ flex: 1 }}>
          <span style={{ display: 'none' }}>Search leads</span>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Company, contact, or product interest" />
        </label>
        <label style={{ width: '180px' }}>
          <span style={{ display: 'none' }}>Status</span>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="ALL">All statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>

      <div className="adminPanel">
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">Lead list</p><h2>All wholesale leads</h2></div>
          <span>{filtered.length} lead{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        {loading ? (
          <div className="adminEmpty"><p>Loading…</p></div>
        ) : error ? (
          <div className="adminEmpty"><p style={{ color: 'var(--admin-danger)' }}>{error}</p></div>
        ) : filtered.length === 0 ? (
          <div className="adminEmpty">
            <span aria-hidden="true">○</span>
            <p><strong>No wholesale leads</strong>B2B inquiries submitted via the wholesale contact form will appear here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map(i => (
              <div key={i.id} className="adminPanel" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                      <strong>{i.customerName}</strong>
                      {i.companyName && <span style={{ color: 'var(--admin-muted)', fontSize: '13px' }}>{i.companyName}</span>}
                    </div>
                    {i.estimatedQuantity && <p style={{ margin: '0 0 4px', fontSize: '12px' }}>Estimated quantity: <strong>{i.estimatedQuantity}</strong></p>}
                    <p style={{ margin: '0 0 8px', fontSize: '14px' }}>{i.message}</p>
                    {i.notes && <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-muted)', fontStyle: 'italic' }}>Notes: {i.notes}</p>}
                    <div style={{ marginTop: '8px', display: 'flex', gap: '6px' }}>
                      <input
                        style={{ flex: 1, fontSize: '13px' }}
                        placeholder="Add or update notes…"
                        value={notesMap[i.id] ?? (i.notes || '')}
                        onChange={e => setNotesMap(m => ({ ...m, [i.id]: e.target.value }))}
                      />
                      <button type="button" onClick={() => doNotes(i.id)} disabled={isPending} style={{ fontSize: '12px' }}>Save notes</button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '110px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600 }}>{i.status}</span>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--admin-muted)' }}>{new Date(i.createdAt).toLocaleDateString()}</p>
                    <select value={i.status} onChange={e => doStatus(i.id, e.target.value)} style={{ fontSize: '12px' }}>
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button type="button" onClick={() => doDelete(i.id)} className="adminDangerButton" style={{ fontSize: '12px' }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
