'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { searchAdmin, type AdminSearchResult } from '@/lib/actions/search';
import { getNotifications } from '@/lib/actions/notifications';

export default function AdminHeader() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AdminSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); setSearching(false); return; }
    const timer = window.setTimeout(async () => {
      setSearching(true);
      const response = await searchAdmin(query);
      setResults(response.results);
      setSearching(false);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    getNotifications(true).then(response => setUnread(response.notifications.length));
  }, []);

  return (
    <header className="adminHeader">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <p className="adminHeaderTitle">Shree Ganesh Pashmina</p>
        <div className="adminHeaderState">
          <span aria-hidden="true" />
          <span style={{ width: 'auto', height: 'auto', borderRadius: 0, background: 'none' }}>Connected</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', flex: '0 1 420px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--admin-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search orders, products, customers..."
            aria-label="Search orders, products, and customers"
            style={{
              width: '100%',
              padding: '7px 12px 7px 36px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--admin-line)',
              background: 'var(--admin-paper)',
              fontSize: '13px',
              color: 'var(--admin-ink)',
              fontFamily: 'var(--font)',
              outline: 'none',
              transition: 'border-color var(--transition-fast)',
            }}
          />
          {(query.trim().length >= 2) && <div role="listbox" style={{ position: 'absolute', zIndex: 20, top: 'calc(100% + 6px)', width: '100%', background: 'var(--admin-paper)', border: '1px solid var(--admin-line)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
            {searching ? <p style={{ margin: 0, padding: '12px', fontSize: '13px', color: 'var(--admin-muted)' }}>Searching…</p> : results.length ? results.map(result => <Link key={result.id} href={result.href} onClick={() => setQuery('')} role="option" style={{ display: 'block', padding: '10px 12px', color: 'var(--admin-ink)', textDecoration: 'none', borderBottom: '1px solid var(--admin-line)' }}><strong style={{ display: 'block', fontSize: '13px' }}>{result.label}</strong><span style={{ fontSize: '12px', color: 'var(--admin-muted)' }}>{result.detail}</span></Link>) : <p style={{ margin: 0, padding: '12px', fontSize: '13px', color: 'var(--admin-muted)' }}>No matching orders, products, or customers.</p>}
          </div>}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Quick link to preview the live storefront */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--admin-line)', background: 'var(--admin-paper)',
            color: 'var(--admin-ink)', textDecoration: 'none', fontSize: '12px',
            fontWeight: 500, letterSpacing: '.01em', transition: 'background .2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--admin-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--admin-paper)')}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          View Store
        </Link>
        <Link href="/admin/notifications" aria-label={`${unread} unread notifications`} style={{ position: 'relative', background: 'none', border: '1px solid var(--admin-line)', borderRadius: 'var(--radius-sm)', padding: '6px 8px', cursor: 'pointer', color: 'var(--admin-muted)', display: 'grid', placeItems: 'center', textDecoration: 'none' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {unread > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-5px', minWidth: '16px', height: '16px', padding: '0 4px', borderRadius: '999px', background: '#dc2626', color: '#fff', fontSize: '10px', display: 'grid', placeItems: 'center' }}>{unread > 99 ? '99+' : unread}</span>}
        </Link>
        <Link href="/admin/settings" style={{ background: 'none', border: '1px solid var(--admin-line)', borderRadius: 'var(--radius-sm)', padding: '6px 8px', cursor: 'pointer', color: 'var(--admin-muted)', display: 'grid', placeItems: 'center', textDecoration: 'none' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </Link>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: 'var(--admin-ink)', color: 'white',
          display: 'grid', placeItems: 'center',
          fontSize: '12px', fontWeight: 700, cursor: 'pointer',
        }}>
          AD
        </div>
      </div>
    </header>
  );
}
