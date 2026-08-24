'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type ProductSort = 'name-asc' | 'price-asc' | 'price-desc';
type Props = { products: any[]; categories: string[] };

export default function ProductList({ products, categories }: Props) {
  const [query, setQuery] = useState(''); 
  const [category, setCategory] = useState('all'); 
  const [sort, setSort] = useState<ProductSort>('name-asc');
  
  const shown = useMemo(() => products.filter((product) => (!query || [product.title, product.handle, product.category?.name].some((value) => value?.toLowerCase().includes(query.toLowerCase()))) && (category === 'all' || product.category?.name === category)).sort((a, b) => {
    // Basic sort. We assume a variant exists or default to 0.
    const priceA = a.variants?.[0]?.price ? Number(a.variants[0].price) : 0;
    const priceB = b.variants?.[0]?.price ? Number(b.variants[0].price) : 0;
    if (sort === 'price-asc') return priceA - priceB;
    if (sort === 'price-desc') return priceB - priceA;
    return a.title.localeCompare(b.title);
  }), [products, query, category, sort]);
  
  return (
    <section className="adminProducts" aria-labelledby="products-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Catalogue</p>
          <h1 id="products-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 600 }}>Products</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Manage your product catalogue, variants and inventory.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="adminSecondaryAction" type="button" disabled>Export</button>
          <button className="adminSecondaryAction" type="button" disabled>Import</button>
          <Link href="/admin/products/new" className="adminPrimaryAction" style={{ borderRadius: 'var(--radius-md)', padding: '8px 16px' }}>
            Add product
          </Link>
        </div>
      </div>
      
      <div className="adminProductTools" style={{ display: 'flex', gap: '16px', padding: '16px', marginTop: '16px', background: 'var(--admin-panel)', borderRadius: 'var(--radius-md)', border: '1px solid var(--admin-line)' }}>
        <label className="adminSearch" style={{ flex: 1, margin: 0 }}>
          <span style={{ display: 'none' }}>Search</span>
          <input 
            value={query} 
            onChange={(event) => setQuery(event.target.value)} 
            placeholder="Search products..." 
            style={{ width: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--admin-line)' }}
          />
        </label>
        <label style={{ margin: 0, width: '200px' }}>
          <span style={{ display: 'none' }}>Category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)} style={{ width: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--admin-line)' }}>
            <option value="all">All categories</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label style={{ margin: 0, width: '200px' }}>
          <span style={{ display: 'none' }}>Sort</span>
          <select value={sort} onChange={(event) => setSort(event.target.value as ProductSort)} style={{ width: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--admin-line)' }}>
            <option value="name-asc">Name, A–Z</option>
            <option value="price-asc">Price, low to high</option>
            <option value="price-desc">Price, high to low</option>
          </select>
        </label>
      </div>
      
      <div className="adminProductTableWrap" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <table className="adminTable">
          <thead style={{ background: 'var(--admin-bg)' }}>
            <tr>
              <th style={{ width: '40px', padding: '12px' }}><input type="checkbox" disabled /></th>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Price</th>
              <th>Inventory</th>
              <th>Status</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {shown.map((product) => {
              const variant = product.variants?.[0];
              const price = variant?.price ? Number(variant.price) : 0;
              const inventory = product.variants?.reduce((sum: number, v: any) => sum + v.inventory, 0) || 0;
              const sku = variant?.sku || '—';
              
              return (
                <tr key={product.id}>
                  <td style={{ padding: '12px' }}><input type="checkbox" disabled /></td>
                  <td>
                    <Link href={`/admin/products/${product.id}`} className="adminProductName" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', background: 'var(--admin-bg)', borderRadius: '6px', border: '1px solid var(--admin-line)', display: 'grid', placeItems: 'center', fontWeight: 600, color: 'var(--admin-muted)' }}>
                        {product.title.slice(0, 1)}
                      </div>
                      <div>
                        <strong style={{ color: 'var(--admin-ink)' }}>{product.title}</strong>
                      </div>
                    </Link>
                  </td>
                  <td><span style={{ color: 'var(--admin-muted)', fontFamily: 'monospace' }}>{sku}</span></td>
                  <td>{product.category?.name || '—'}</td>
                  <td>${price.toLocaleString()}</td>
                  <td><span style={{ color: 'var(--admin-muted)', background: 'var(--admin-bg)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px' }}>{inventory} in stock</span></td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 8px', borderRadius: '4px', background: product.status === 'PUBLISHED' ? '#EFF6FF' : '#F3F4F6', color: product.status === 'PUBLISHED' ? '#1D4ED8' : '#4B5563', fontSize: '11px', fontWeight: 500 }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: product.status === 'PUBLISHED' ? '#3B82F6' : '#9CA3AF' }}></span> {product.status === 'PUBLISHED' ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link href={`/admin/products/${product.id}`} style={{ color: 'var(--admin-muted)', textDecoration: 'none', fontWeight: 500, fontSize: '13px' }}>Edit</Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {shown.length === 0 && (
          <div className="adminEmpty" style={{ background: 'var(--admin-panel)' }}>
            <span aria-hidden="true" style={{ fontSize: '32px', color: 'var(--admin-line)' }}>○</span>
            <p style={{ marginTop: '16px' }}><strong>No products found</strong></p>
            <p>Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </section>
  );
}
