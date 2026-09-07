'use client';

import Link from 'next/link';
import { ChangeEvent, useMemo, useRef, useState, useTransition } from 'react';
import { importProducts, updateProduct, type ProductImportRow } from '@/lib/actions/products';
import { createOrder } from '@/lib/actions/orders';

type ProductSort = 'name-asc' | 'price-asc' | 'price-desc';
type Props = { products: any[]; categories: string[] };

export default function ProductList({ products, categories }: Props) {
  const [query, setQuery] = useState(''); 
  const [category, setCategory] = useState('all'); 
  const [sort, setSort] = useState<ProductSort>('name-asc');
  const [isImporting, startImport] = useTransition();
  const [notice, setNotice] = useState<string | null>(null);
  const importInput = useRef<HTMLInputElement>(null);
  
  const shown = useMemo(() => products.filter((product) => (!query || [product.title, product.handle, product.category?.name].some((value) => value?.toLowerCase().includes(query.toLowerCase()))) && (category === 'all' || product.category?.name === category)).sort((a, b) => {
    // Basic sort. We assume a variant exists or default to 0.
    const priceA = a.variants?.[0]?.price ? Number(a.variants[0].price) : 0;
    const priceB = b.variants?.[0]?.price ? Number(b.variants[0].price) : 0;
    if (sort === 'price-asc') return priceA - priceB;
    if (sort === 'price-desc') return priceB - priceA;
    return a.title.localeCompare(b.title);
  }), [products, query, category, sort]);
  
  const csvEscape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  const exportProducts = () => {
    const header = ['title', 'handle', 'description', 'category', 'status', 'price', 'compareAtPrice', 'sku', 'stock', 'imageUrl'];
    const csv = [header, ...shown.map(product => {
      const variant = product.variants?.[0];
      return [product.title, product.handle, product.description, product.category?.name, product.status, variant?.price, variant?.compareAtPrice, variant?.sku, product.variants?.reduce((sum: number, item: any) => sum + item.inventory, 0), product.images?.[0]?.url];
    })].map(row => row.map(csvEscape).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'shree-ganesh-products.csv'; link.click();
    URL.revokeObjectURL(url);
    setNotice(`${shown.length} product${shown.length === 1 ? '' : 's'} exported.`);
  };

  const parseCsv = (text: string) => {
    const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter(line => line.trim());
    const parseLine = (line: string) => Array.from(line.matchAll(/(?:^|,)(?:"((?:[^"]|"")*)"|([^",]*))/g), match => (match[1] ?? match[2] ?? '').replace(/""/g, ''));
    const headers = parseLine(lines[0] || '').map(header => header.trim());
    return lines.slice(1).map(line => Object.fromEntries(headers.map((header, i) => [header, parseLine(line)[i]?.trim() || ''])));
  };

  const toNumber = (value: string) => value === '' ? undefined : Number(value);
  const importCsv = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv')) { setNotice('Please select a CSV file.'); return; }
    const raw = parseCsv(await file.text());
    const rows: ProductImportRow[] = raw.map(row => ({
      title: row.title, handle: row.handle || undefined, description: row.description || undefined, category: row.category || undefined,
      status: row.status?.toUpperCase() as ProductImportRow['status'], price: toNumber(row.price),
      compareAtPrice: toNumber(row.compareAtPrice), sku: row.sku || undefined, stock: toNumber(row.stock), imageUrl: row.imageUrl || undefined,
    }));
    startImport(async () => {
      const result = await importProducts(rows);
      setNotice(result.errors.length ? `${result.imported} imported, ${result.updated} updated. ${result.errors.slice(0, 2).join(' ')}` : `${result.imported} imported and ${result.updated} updated.`);
    });
  };

  return (
    <section className="adminProducts" aria-labelledby="products-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Catalogue</p>
          <h1 id="products-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 600 }}>Products</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Manage your product catalogue, variants and inventory.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="adminSecondaryAction" type="button" onClick={exportProducts}>Export CSV</button>
          <button className="adminSecondaryAction" type="button" onClick={() => importInput.current?.click()} disabled={isImporting}>{isImporting ? 'Importing…' : 'Import CSV'}</button>
          <input ref={importInput} type="file" accept=".csv,text/csv" onChange={importCsv} hidden />
          <Link href="/admin/products/new" className="adminPrimaryAction" style={{ borderRadius: 'var(--radius-md)', padding: '8px 16px' }}>
            Add product
          </Link>
        </div>
      </div>
      {notice && <p role="status" style={{ margin: '12px 0 0', fontSize: '13px', color: 'var(--admin-muted)' }}>{notice}</p>}
      
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
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        className="adminSecondaryAction"
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                        onClick={() => {
                          const newPrice = prompt(`Update price for ${product.title}:`, price.toString());
                          if (newPrice && !isNaN(Number(newPrice))) {
                            startImport(async () => {
                              const res = await updateProduct(product.id, { price: Number(newPrice) });
                              if (res.error) setNotice(`Error: ${res.error}`);
                              else setNotice(`Price updated to $${newPrice} for ${product.title}`);
                            });
                          }
                        }}
                      >
                        Quick Price
                      </button>

                      <button
                        type="button"
                        className="adminPrimaryAction"
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                        onClick={() => {
                          const qtyStr = prompt(`Enter quantity sold for ${product.title}:`, '1');
                          if (qtyStr && !isNaN(Number(qtyStr)) && Number(qtyStr) > 0) {
                            const qty = Number(qtyStr);
                            const customerEmail = prompt('Customer Email (or leave default):', 'store-sale@shreeganesh.com') || 'store-sale@shreeganesh.com';
                            startImport(async () => {
                              const res = await createOrder({
                                customerEmail,
                                total: price * qty,
                                items: [{ productId: product.id, variantId: variant?.id, quantity: qty, price }],
                              });
                              if (res.error) setNotice(`Error: ${res.error}`);
                              else setNotice(`Recorded sale of ${qty}x ${product.title} ($${(price * qty).toFixed(2)})! Analytics updated.`);
                            });
                          }
                        }}
                      >
                        Record Sale
                      </button>

                      <Link href={`/admin/products/${product.id}`} style={{ color: 'var(--admin-muted)', textDecoration: 'none', fontWeight: 500, fontSize: '13px', alignSelf: 'center' }}>Edit</Link>
                    </div>
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
