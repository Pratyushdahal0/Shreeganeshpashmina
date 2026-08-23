import Link from 'next/link';

export default function AdminHeader() {
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
            placeholder="Search orders, products, customers..."
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
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button type="button" style={{ background: 'none', border: '1px solid var(--admin-line)', borderRadius: 'var(--radius-sm)', padding: '6px 8px', cursor: 'pointer', color: 'var(--admin-muted)', display: 'grid', placeItems: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>
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
