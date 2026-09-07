import { Suspense } from 'react';
import { getPublishedProducts } from '@/lib/actions/products';
import { getActiveDiscounts } from '@/lib/actions/discounts';
import { products as staticProducts } from '@/lib/data';
import { type CardProduct } from '@/components/ProductCard';
import ShopClient from './ShopClient';

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

export default async function Shop() {
  const [{ products: dbProducts }, { discounts: activeDiscounts }] = await Promise.all([
    getPublishedProducts(),
    getActiveDiscounts(),
  ]);

  // Fallback to static data if DB is cold
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

  let cardProducts = products.map((p, i) => toCard(p, i));
  if (!cardProducts.some(p => p.isNew)) {
    cardProducts = cardProducts.map((p, i) => (i < 4 ? { ...p, isNew: true } : p));
  }
  if (!cardProducts.some(p => p.featured)) {
    cardProducts = cardProducts.map((p, i) => (i < 6 ? { ...p, featured: true } : p));
  }
  const categories = Array.from(new Set(['All Pashmina', ...cardProducts.map(p => p.category)]));

  return (
    <Suspense fallback={<main className="productPage"><div className="container"><p>Loading shop...</p></div></main>}>
      <ShopClient initialProducts={cardProducts} categories={categories} activeDiscounts={activeDiscounts} />
    </Suspense>
  );
}
