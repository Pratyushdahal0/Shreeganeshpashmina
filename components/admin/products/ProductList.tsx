'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { AdminProduct, ProductSort } from '@/lib/admin/products';

type Props = { products: AdminProduct[]; categories: string[] };
const unavailable = 'Unavailable';

export default function ProductList({ products, categories }: Props) {
  const [query, setQuery] = useState(''); const [category, setCategory] = useState('all'); const [sort, setSort] = useState<ProductSort>('name-asc');
  const shown = useMemo(() => products.filter((product) => (!query || [product.name, product.slug, product.category].some((value) => value.toLowerCase().includes(query.toLowerCase()))) && (category === 'all' || product.category === category)).sort((a, b) => sort === 'price-asc' ? a.price - b.price : sort === 'price-desc' ? b.price - a.price : a.name.localeCompare(b.name)), [products, query, category, sort]);
  return <section className="adminProducts" aria-labelledby="products-title">
    <div className="adminProductsIntro"><div><p className="adminEyebrow">Catalogue</p><h1 id="products-title">Products</h1><p>Manage the storefront catalogue and product configuration.</p></div><Link href="/admin/products/new" className="adminPrimaryAction">Create product</Link></div>
    <div className="adminNotice"><div><strong>Static storefront catalogue</strong><span>Showing {products.length} existing local products. Product persistence and operational status data are not connected.</span></div><span className="adminNoticeTag">Development source</span></div>
    <div className="adminProductTools"><label className="adminSearch"><span>Search</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, slug, or category" /></label><label><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">All categories</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><label><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value as ProductSort)}><option value="name-asc">Name, A–Z</option><option value="price-asc">Price, low to high</option><option value="price-desc">Price, high to low</option></select></label></div>
    <p className="adminProductCount">{shown.length} {shown.length === 1 ? 'product' : 'products'}</p>
    <div className="adminProductTableWrap"><table className="adminProductTable"><thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Price</th><th>Stock</th><th>Publication</th><th>Updated</th><th aria-label="Actions" /></tr></thead><tbody>{shown.map((product) => <tr key={product.id}><td><Link href={`/admin/products/${product.id}`} className="adminProductName"><span>{product.name.slice(0, 1)}</span><div><strong>{product.name}</strong><small>/{product.slug}</small></div></Link></td><td>{product.sku ?? '—'}</td><td>{product.category}</td><td>USD ${product.price.toLocaleString()}</td><td><span className="adminUnknown">{unavailable}</span></td><td><span className="adminUnknown">{unavailable}</span></td><td>—</td><td><Link className="adminRowAction" href={`/admin/products/${product.id}`}>Edit</Link></td></tr>)}</tbody></table>{shown.length === 0 && <div className="adminProductEmpty"><strong>No products match these filters.</strong><span>Try a different search term or category.</span></div>}</div>
  </section>;
}
