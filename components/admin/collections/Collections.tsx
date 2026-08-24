'use client';
import Link from 'next/link';
import { useState } from 'react';

type Props = { collections: any[] };

export default function Collections({ collections }: Props) { 
  const [query, setQuery] = useState(''); 
  const shown = collections.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())); 
  
  return (
    <section className="adminCollections" aria-labelledby="collections-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Catalogue</p>
          <h1 id="collections-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 600 }}>Collections</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Organize storefront products using the database.</p>
        </div>
        <Link href="/admin/collections/new" className="adminPrimaryAction" style={{ borderRadius: 'var(--radius-md)', padding: '8px 16px', height: 'fit-content' }}>
          Create collection
        </Link>
      </div>

      <div className="adminProductTools adminCollectionTools" style={{ display: 'flex', gap: '16px', padding: '16px', marginTop: '16px', background: 'var(--admin-panel)', borderRadius: 'var(--radius-md)', border: '1px solid var(--admin-line)' }}>
        <label className="adminSearch" style={{ flex: 1, margin: 0 }}>
          <span style={{ display: 'none' }}>Search collections</span>
          <input 
            value={query} 
            onChange={(event) => setQuery(event.target.value)} 
            placeholder="Search collections..." 
            style={{ width: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--admin-line)' }}
          />
        </label>
      </div>

      <div className="adminCollectionList">
        {shown.map((collection) => (
          <article key={collection.id} style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
            <div>
              <p className="adminEyebrow">{collection.products?.length || 0} products</p>
              <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '8px 0' }}>{collection.name}</h2>
              <span style={{ color: 'var(--admin-muted)' }}>{collection.description || 'No description provided.'}</span>
            </div>
            <Link href={`/admin/collections/${collection.slug}`} style={{ fontWeight: 500 }}>Manage</Link>
          </article>
        ))}
      </div>
      
      {shown.length === 0 && (
        <div className="adminEmpty" style={{ background: 'var(--admin-panel)', marginTop: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--admin-line)' }}>
          <span aria-hidden="true" style={{ fontSize: '32px', color: 'var(--admin-line)' }}>○</span>
          <p style={{ marginTop: '16px' }}><strong>No collections found</strong></p>
          <p>Create a collection to organize your products.</p>
        </div>
      )}
    </section>
  ); 
}
