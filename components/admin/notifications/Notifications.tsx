'use client';
import { useState } from 'react';
import { notificationService } from '@/lib/admin/notifications';

const types = ['New order','Payment failure','Low stock','New WhatsApp inquiry','New wholesale inquiry','Return request','Production issue','New review'];

export function Notifications() {
  const [msg, setMsg] = useState<string | null>(null);

  const markAll = async () => setMsg((await notificationService.markAllRead()).message);

  return (
    <section className="adminNotifications" aria-labelledby="notifications-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Operations</p>
          <h1 id="notifications-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>Notifications</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Actionable operational alerts with related entity links.</p>
        </div>
        <button className="adminSecondaryAction" type="button" onClick={markAll}>Mark all read</button>
      </div>

      <div className="adminNotice">
        <div>
          <strong>Notifications are not connected</strong>
          <span>No business events have been persisted, so no notification feed or read state is available.</span>
        </div>
        <span className="adminNoticeTag">No persistence</span>
      </div>

      {msg && <div className="adminFormMessage">{msg}</div>}

      <section className="adminNotificationTypes">
        {types.map(type => <span key={type}>{type}<strong>—</strong></span>)}
      </section>

      <div className="adminPanel">
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">Inbox</p><h2>All notifications</h2></div>
          <span>Unavailable</span>
        </div>
        <div className="adminEmpty">
          <span aria-hidden="true">○</span>
          <p><strong>No notifications available</strong>Connect event-driven storage to show unread state, timestamps, related records, and appropriate action links.</p>
        </div>
      </div>
    </section>
  );
}

export function AuditLogs() {
  return (
    <section className="adminNotifications" aria-labelledby="audit-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Security</p>
          <h1 id="audit-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>Audit logs</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Append-only records of important administrative changes.</p>
        </div>
      </div>

      <div className="adminNotice">
        <div>
          <strong>Audit storage is not connected</strong>
          <span>No administrative mutations currently persist, so there are no genuine audit records to display.</span>
        </div>
        <span className="adminNoticeTag">No persistence</span>
      </div>

      <section className="adminAuditActions">
        {['Product created','Product edited','Price changed','Stock changed','Order status changed','Refund created','User created','Permission changed','Content published'].map(action => (
          <span key={action}>{action}</span>
        ))}
      </section>

      <div className="adminPanel">
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">Append-only history</p><h2>All actions</h2></div>
          <span>Unavailable</span>
        </div>
        <div className="adminEmpty">
          <span aria-hidden="true">○</span>
          <p><strong>No audit records available</strong>Future server-side mutations must record actor, action, entity, previous value, new value, and timestamp in the same transaction.</p>
        </div>
      </div>
    </section>
  );
}
