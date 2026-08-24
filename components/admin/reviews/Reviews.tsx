'use client';
import { useEffect, useState, useTransition } from 'react';
import { getReviews, moderateReview, deleteReview } from '@/lib/actions/reviews';

type Review = Awaited<ReturnType<typeof getReviews>>['reviews'][number];
type Filter = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

const STARS = ['★★★★★', '★★★★☆', '★★★☆☆', '★★☆☆☆', '★☆☆☆☆'];

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<Filter>('ALL');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const load = async (f: Filter) => {
    setLoading(true);
    const res = await getReviews(f === 'ALL' ? undefined : f as any);
    setReviews(res.reviews);
    setError(res.error);
    setLoading(false);
  };

  useEffect(() => { load(filter); }, [filter]);

  const filtered = reviews.filter(r =>
    !q || r.authorName.toLowerCase().includes(q.toLowerCase()) ||
    r.authorEmail.toLowerCase().includes(q.toLowerCase()) ||
    r.comment.toLowerCase().includes(q.toLowerCase()) ||
    r.product?.title?.toLowerCase().includes(q.toLowerCase())
  );

  const doModerate = (id: string, status: 'APPROVED' | 'REJECTED') => {
    startTransition(async () => {
      await moderateReview(id, status);
      await load(filter);
    });
  };

  const doDelete = (id: string) => {
    if (!confirm('Delete this review?')) return;
    startTransition(async () => {
      await deleteReview(id);
      await load(filter);
    });
  };

  return (
    <section className="adminReviews" aria-labelledby="reviews-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Storefront trust</p>
          <h1 id="reviews-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>Reviews</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Moderate customer reviews before they become visible on the storefront.</p>
        </div>
      </div>

      <div className="adminProductTools">
        <label className="adminSearch" style={{ flex: 1 }}>
          <span style={{ display: 'none' }}>Search reviews</span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Customer, product, or review text" />
        </label>
        <label style={{ width: '180px' }}>
          <span style={{ display: 'none' }}>Status</span>
          <select value={filter} onChange={e => setFilter(e.target.value as Filter)}>
            <option value="ALL">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </label>
      </div>

      <div className="adminPanel">
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">Moderation queue</p><h2>All reviews</h2></div>
          <span>{filtered.length} review{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        {loading ? (
          <div className="adminEmpty"><p>Loading…</p></div>
        ) : error ? (
          <div className="adminEmpty"><p style={{ color: 'var(--admin-danger)' }}>{error}</p></div>
        ) : filtered.length === 0 ? (
          <div className="adminEmpty">
            <span aria-hidden="true">○</span>
            <p><strong>No reviews found</strong>Reviews submitted by customers will appear here for moderation.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map(r => (
              <div key={r.id} className="adminPanel" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                      <strong>{r.authorName}</strong>
                      <span style={{ color: 'var(--admin-muted)', fontSize: '13px' }}>{r.authorEmail}</span>
                      <span style={{ color: '#f59e0b' }}>{STARS[5 - r.rating]}</span>
                    </div>
                    <p style={{ color: 'var(--admin-muted)', fontSize: '12px', margin: '0 0 4px' }}>
                      Product: <strong>{r.product?.title || '—'}</strong> · {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                    <p style={{ margin: 0 }}>{r.comment}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '100px' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: '4px', fontSize: '11px', textAlign: 'center',
                      background: r.status === 'APPROVED' ? '#d1fae5' : r.status === 'REJECTED' ? '#fee2e2' : '#fef3c7',
                      color: r.status === 'APPROVED' ? '#065f46' : r.status === 'REJECTED' ? '#991b1b' : '#92400e',
                    }}>{r.status}</span>
                    {r.status !== 'APPROVED' && (
                      <button type="button" onClick={() => doModerate(r.id, 'APPROVED')} disabled={isPending} style={{ fontSize: '12px', padding: '4px 8px' }}>Approve</button>
                    )}
                    {r.status !== 'REJECTED' && (
                      <button type="button" onClick={() => doModerate(r.id, 'REJECTED')} disabled={isPending} style={{ fontSize: '12px', padding: '4px 8px' }}>Reject</button>
                    )}
                    <button type="button" onClick={() => doDelete(r.id)} className="adminDangerButton" disabled={isPending} style={{ fontSize: '12px', padding: '4px 8px' }}>Delete</button>
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
