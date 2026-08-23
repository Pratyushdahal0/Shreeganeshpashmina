'use client';
import Link from 'next/link';

const sections = [
  ['Production', 'Production orders, stages, staff, dates, materials, and notes.', 'production'],
  ['Materials', 'Material codes, quantities, units, suppliers, stock, and cost.', 'materials'],
  ['Suppliers', 'Supplier contacts, materials, notes, and operating status.', 'suppliers'],
  ['Quality control', 'Production-linked inspection results and supporting images.', 'quality'],
];

export default function Factory() {
  return (
    <section className="adminFactory" aria-labelledby="factory-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Manufacturing</p>
          <h1 id="factory-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>Factory overview</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>A focused production foundation — not a full ERP.</p>
        </div>
      </div>

      <div className="adminNotice">
        <div>
          <strong>Factory operations are not connected</strong>
          <span>No production, material, supplier, stock, quality-control, staff, or manufacturing statistics are available.</span>
        </div>
        <span className="adminNoticeTag">No persistence</span>
      </div>

      <section className="adminFactoryStages">
        {['Planned', 'Materials Required', 'In Production', 'Quality Check', 'Completed', 'Cancelled'].map(stage => (
          <span key={stage}>{stage}<strong>—</strong></span>
        ))}
      </section>

      <div className="adminFactoryGrid">
        {sections.map(([title, text, path]) => (
          <article key={path}>
            <p className="adminEyebrow">Factory</p>
            <h2>{title}</h2>
            <span>{text}</span>
            <Link href={`/admin/factory/${path}`}>Open {title.toLowerCase()}</Link>
          </article>
        ))}
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

      <div className="adminNotice">
        <div>
          <strong>Data unavailable</strong>
          <span>Connect the factory operations backend to manage these records. No operational data has been fabricated.</span>
        </div>
        <span className="adminNoticeTag">No persistence</span>
      </div>

      <div className="adminPanel">
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">{title}</p><h2>All records</h2></div>
          <span>Unavailable</span>
        </div>
        <div className="adminEmpty">
          <span aria-hidden="true">○</span>
          <p><strong>No records available</strong>{text}</p>
        </div>
      </div>
    </section>
  );
}
