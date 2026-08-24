'use client';
import { useEffect, useState, useTransition } from 'react';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from '@/lib/actions/notifications';
import { getAuditLogs } from '@/lib/actions/audit';

type Notification = Awaited<ReturnType<typeof getNotifications>>['notifications'][number];
type AuditLog = Awaited<ReturnType<typeof getAuditLogs>>['logs'][number];

const typeColors: Record<string, string> = {
  ORDER: '#dbeafe', PAYMENT: '#d1fae5', STOCK: '#fef3c7',
  INQUIRY: '#ede9fe', REVIEW: '#fce7f3', OTHER: '#f3f4f6',
};

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const load = async () => {
    setLoading(true);
    const res = await getNotifications();
    setNotifications(res.notifications);
    setError(res.error);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const doMarkRead = (id: string) => {
    startTransition(async () => { await markNotificationRead(id); await load(); });
  };

  const doMarkAllRead = () => {
    startTransition(async () => { await markAllNotificationsRead(); await load(); });
  };

  const doDelete = (id: string) => {
    startTransition(async () => { await deleteNotification(id); await load(); });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <section className="adminNotifications" aria-labelledby="notifications-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Operations</p>
          <h1 id="notifications-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>
            Notifications {unreadCount > 0 && <span style={{ fontSize: '14px', fontWeight: 400, background: '#ef4444', color: '#fff', borderRadius: '99px', padding: '2px 8px', marginLeft: '8px' }}>{unreadCount} unread</span>}
          </h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Actionable operational alerts with related entity links.</p>
        </div>
        <button className="adminSecondaryAction" type="button" onClick={doMarkAllRead} disabled={isPending || unreadCount === 0}>
          Mark all read
        </button>
      </div>

      <div className="adminPanel">
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">Inbox</p><h2>All notifications</h2></div>
          <span>{notifications.length} notification{notifications.length !== 1 ? 's' : ''}</span>
        </div>
        {loading ? (
          <div className="adminEmpty"><p>Loading…</p></div>
        ) : error ? (
          <div className="adminEmpty"><p style={{ color: 'var(--admin-danger)' }}>{error}</p></div>
        ) : notifications.length === 0 ? (
          <div className="adminEmpty">
            <span aria-hidden="true">○</span>
            <p><strong>No notifications</strong>Operational alerts will appear here when events occur.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {notifications.map(n => (
              <div key={n.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                padding: '12px 16px', borderRadius: '6px',
                background: n.isRead ? 'transparent' : (typeColors[n.type] || '#f3f4f6'),
                border: '1px solid var(--admin-line)',
                opacity: n.isRead ? 0.7 : 1,
              }}>
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '2px' }}>
                    <strong style={{ fontSize: '14px' }}>{n.title}</strong>
                    <span style={{ fontSize: '11px', color: 'var(--admin-muted)' }}>{n.type}</span>
                    {!n.isRead && <span style={{ fontSize: '10px', background: '#ef4444', color: '#fff', borderRadius: '99px', padding: '0 6px' }}>NEW</span>}
                  </div>
                  <p style={{ margin: 0, fontSize: '13px' }}>{n.message}</p>
                  <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--admin-muted)' }}>{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  {!n.isRead && <button type="button" onClick={() => doMarkRead(n.id)} disabled={isPending} style={{ fontSize: '12px' }}>Mark read</button>}
                  <button type="button" onClick={() => doDelete(n.id)} className="adminDangerButton" disabled={isPending} style={{ fontSize: '12px' }}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await getAuditLogs(q || undefined);
    setLogs(res.logs);
    setError(res.error);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <section className="adminNotifications" aria-labelledby="audit-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Security</p>
          <h1 id="audit-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>Audit logs</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Append-only records of all important administrative changes.</p>
        </div>
      </div>

      <div className="adminProductTools">
        <label className="adminSearch" style={{ flex: 1 }}>
          <span style={{ display: 'none' }}>Search logs</span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Actor, action, or target…" onKeyDown={e => e.key === 'Enter' && load()} />
        </label>
        <button type="button" className="adminSecondaryAction" onClick={load}>Search</button>
      </div>

      <div className="adminPanel">
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">Append-only history</p><h2>All actions</h2></div>
          <span>{logs.length} log{logs.length !== 1 ? 's' : ''}</span>
        </div>
        {loading ? (
          <div className="adminEmpty"><p>Loading…</p></div>
        ) : error ? (
          <div className="adminEmpty"><p style={{ color: 'var(--admin-danger)' }}>{error}</p></div>
        ) : logs.length === 0 ? (
          <div className="adminEmpty">
            <span aria-hidden="true">○</span>
            <p><strong>No audit records</strong>Admin actions will be logged here automatically.</p>
          </div>
        ) : (
          <table className="adminTable" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><th>Actor</th><th>Action</th><th>Target</th><th>Timestamp</th></tr>
            </thead>
            <tbody>
              {logs.map(l => (
                <tr key={l.id}>
                  <td>{l.actorEmail}</td>
                  <td><strong>{l.action}</strong></td>
                  <td>{l.target || '—'}</td>
                  <td style={{ fontSize: '12px', color: 'var(--admin-muted)' }}>{new Date(l.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
