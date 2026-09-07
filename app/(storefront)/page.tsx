import Image from 'next/image';
import Link from 'next/link';
import { getPublishedProducts } from '@/lib/actions/products';
import { getSiteContent } from '@/lib/actions/content';
import { getArticles } from '@/lib/actions/journal';
import { getActiveDiscounts } from '@/lib/actions/discounts';
import ProductCard, { type CardProduct } from '@/components/ProductCard';
import Reveal from '@/components/Reveal';
import { Icon } from '@/components/Icons';
import TextReveal from '@/components/TextReveal';
import HeroSection from '@/components/HeroSection';
import { products as staticProducts } from '@/lib/data';
import PromoBanner from '@/components/PromoBanner';

function toCard(p: Awaited<ReturnType<typeof getPublishedProducts>>['products'][number], index: number): CardProduct {
  const firstVariant = p.variants[0];
  const firstImage = p.images[0];

  const staticNew = (p as any).new ?? (p as any).isNew;
  const staticFeatured = (p as any).featured;

  const isNew = staticNew ?? (p.createdAt ? (Date.now() - new Date(p.createdAt).getTime()) < 30 * 24 * 60 * 60 * 1000 : index < 3);
  const featured = staticFeatured ?? (index < 6);

  return {
    id: p.id,
    slug: p.handle,
    name: p.title,
    category: p.category?.name ?? 'Pashmina',
    material: p.description?.split('\n')[0] ?? 'Pashmina',
    price: firstVariant ? Number(firstVariant.price) : 0,
    image: firstImage?.thumbUrl || firstImage?.url || '/images/product-shawl.jpg',
    description: p.description ?? '',
    isNew: Boolean(isNew),
    featured: Boolean(featured),
  };
}

export default async function Home() {
  const [{ products: dbProducts }, homepageContent, heroBanners, { articles }, { discounts: activeDiscounts }] = await Promise.all([
    getPublishedProducts(),
    getSiteContent('homepage'),
    getSiteContent('hero_banners'),
    getArticles('PUBLISHED'),
    getActiveDiscounts(),
  ]);

  // Fallback to static data if DB is cold or returns empty
  const products = dbProducts.length > 0 ? dbProducts : staticProducts.map(p => ({
    id: p.id,
    title: p.name,
    handle: p.slug,
    description: p.description,
    category: { id: '', name: p.category },
    variants: [{ id: '', price: p.price as unknown as any, inventory: 10, sku: '' }],
    images: [{ url: p.image, thumbUrl: p.image, alt: p.name }],
    status: 'PUBLISHED' as const,
    createdAt: new Date(),
    new: (p as any).new,
    featured: (p as any).featured,
  }));

  let cards = products.map((p, i) => toCard(p, i));
  if (!cards.some(p => p.isNew)) {
    cards = cards.map((p, i) => (i < 4 ? { ...p, isNew: true } : p));
  }
  if (!cards.some(p => p.featured)) {
    cards = cards.map((p, i) => (i < 6 ? { ...p, featured: true } : p));
  }

  const newArrivals = cards.filter(c => c.isNew).slice(0, 3);
  const featured = newArrivals.length > 0 ? newArrivals : cards.slice(0, 3);
  const bestSellers = cards.filter(c => c.featured).slice(0, 6);
  const latestArticles = articles.slice(0, 3);

  const hc = homepageContent.data;
  const hb = heroBanners.data;

  return (
    <main>
      <section className="hero">
        <HeroSection heroImg={hb.heroImg || '/images/hero-editorial.jpg'} />
        <div className="heroOverlay" />
        <div className="heroContent">
          <div className="eyebrow" style={{ color: 'rgba(255,255,255,.8)' }}>{hc.eyebrow}</div>
          <h1 className="heroTitle">
            <TextReveal>{hc.heroTitle}</TextReveal>
          </h1>
          <p className="heroCopy">{hc.heroCopy}</p>
          <div className="heroActions">
            <Link className="btn" href="/shop">Explore the collection <Icon name="arrow" /></Link>
            <Link className="btn" href="/craft">Discover our craft</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container introGrid">
          <Reveal>
            <div className="eyebrow">{hc.introEyebrow}</div>
            <h2 className="introTitle" style={{ whiteSpace: 'pre-line' }}>{hc.introTitle}</h2>
          </Reveal>
          <Reveal>
            <p className="introCopy">{hc.introCopy}</p>
            <div style={{ marginTop: 30 }}>
              <Link className="btn" href="/shop">View all pieces <Icon name="arrow" /></Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container">
        <Reveal>
          <Image
            className="collectionImage"
            src={hb.collectionImg || '/images/collection-shawls.jpg'}
            alt="Stacked shawls and stoles"
            width={1600}
            height={1100}
          />
        </Reveal>
      </section>

      {featured.length > 0 && (
        <section className="section">
          <div className="container">
            {/* Promo banner: visible when admin has active discount codes */}
            <PromoBanner discounts={activeDiscounts} />
            <div className="sectionHead">
              <div>
                <div className="eyebrow">Selected pieces</div>
                <h2>New arrivals</h2>
              </div>
              <Link className="btn" href="/shop?filter=new">View collection <Icon name="arrow" /></Link>
            </div>
            <div className="productGrid">
              {featured.map(p => (
                <Reveal key={p.id}><ProductCard product={p} /></Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="split">
        {/* position:relative required for Next.js fill images */}
        <Reveal className="splitMedia" style={{ position: 'relative' }}>
          <Image
            src={hb.craftLoomImg || '/images/craft-loom.jpg'}
            alt="Craftsperson working at a loom"
            fill
            sizes="50vw"
            style={{ objectFit: 'cover' }}
          />
        </Reveal>
        <Reveal className="splitCopy">
          <div>
            <div className="eyebrow">{hc.craftEyebrow}</div>
            <h2 style={{ whiteSpace: 'pre-line' }}>{hc.craftTitle}</h2>
            <p>{hc.craftCopy}</p>
            <Link className="btn" href="/craft">See how it is made <Icon name="arrow" /></Link>
          </div>
        </Reveal>
      </section>

      {bestSellers.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="sectionHead">
              <div>
                <div className="eyebrow">The edit</div>
                <h2>Best sellers</h2>
              </div>
              <Link className="btn" href="/shop?filter=best">Shop best sellers <Icon name="arrow" /></Link>
            </div>
            <div className="productGrid">
              {bestSellers.map(p => (
                <Reveal key={p.id}><ProductCard product={p} /></Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Journal / Blog Section on Homepage */}
      {latestArticles.length > 0 && (
        <section className="section" style={{ background: '#fdfbf7', borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
          <div className="container">
            <div className="sectionHead">
              <div>
                <div className="eyebrow">From The Journal</div>
                <h2>Stories, Craft & Material</h2>
              </div>
              <Link className="btn" href="/journal">Read all stories <Icon name="arrow" /></Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px', marginTop: '30px' }}>
              {latestArticles.map(a => (
                <Reveal key={a.id}>
                  <Link href={`/journal/${a.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    {a.image && (
                      <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '4px', overflow: 'hidden', marginBottom: '15px' }}>
                        <Image src={a.image} alt={a.title} fill style={{ objectFit: 'cover' }} />
                      </div>
                    )}
                    <div className="eyebrow" style={{ fontSize: '11px', marginBottom: '4px' }}>
                      {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : ''} · By {a.author}
                    </div>
                    <h3 className="serif" style={{ fontSize: '22px', fontWeight: 400, margin: '6px 0 10px' }}>{a.title}</h3>
                    {a.excerpt && <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.5, margin: 0 }}>{a.excerpt}</p>}
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 850 }}>
          <div className="eyebrow">{hc.footerEyebrow}</div>
          <h2 className="serif" style={{ fontWeight: 400, fontSize: 'clamp(42px,6vw,80px)', lineHeight: 1.05, whiteSpace: 'pre-line' }}>
            {hc.footerTitle}
          </h2>
          <p className="muted" style={{ lineHeight: 1.8 }}>
            {hc.footerCopy}
          </p>
        </div>
      </section>
    </main>
  );
}
