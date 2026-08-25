'use client';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard, { type CardProduct } from '@/components/ProductCard';
import Reveal from '@/components/Reveal';

export default function ShopClient({
  initialProducts,
  categories,
}: {
  initialProducts: CardProduct[];
  categories: string[];
}) {
  const [cat, setCat] = useState('All Pashmina');
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter');
  const material = searchParams.get('material');
  const query = searchParams.get('q')?.trim().toLowerCase() || '';

  const collection =
    filter === 'new'
      ? { eyebrow: 'The latest collection', heading: 'NEW ARRIVALS' }
      : filter === 'best'
      ? { eyebrow: 'The collection', heading: 'BEST SELLERS' }
      : { eyebrow: 'The collection', heading: 'Shop' };

  const shown = useMemo(
    () =>
      initialProducts.filter(
        p =>
          (cat === 'All Pashmina' || p.category === cat) &&
          (!filter || (filter === 'new' ? p.isNew : filter === 'best' ? p.featured : true)) &&
          (!material || p.material.toLowerCase().includes(material.toLowerCase())) &&
          (!query || [p.name, p.category, p.material, p.description].some(value => value.toLowerCase().includes(query)))
      ),
    [initialProducts, cat, filter, material, query]
  );

  return (
    <main className="productPage">
      <div className="container">
        <div className="sectionHead">
          <div>
            <div className="eyebrow">{collection.eyebrow}</div>
            <h1
              className="serif"
              style={{ fontWeight: 400, fontSize: 'clamp(48px,6vw,88px)', margin: '15px 0 0' }}
            >
              {collection.heading}
            </h1>
          </div>
        </div>
        <div className="filters" style={{ marginBottom: 40 }}>
          {categories.map(c => (
            <button
              key={c}
              className={`filter ${cat === c ? 'active' : ''}`}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
        {shown.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <p style={{ fontSize: '18px', color: 'var(--admin-muted, #666)' }}>No products found. Try a different search or category.</p>
          </div>
        ) : (
          <div className="productGrid">
            {shown.map(p => (
              <Reveal key={p.id}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
