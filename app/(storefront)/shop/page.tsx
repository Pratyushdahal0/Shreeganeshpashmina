import { Suspense } from 'react';
import { getPublishedProducts } from '@/lib/actions/products';
import { type CardProduct } from '@/components/ProductCard';
import ShopClient from './ShopClient';

function toCard(p: Awaited<ReturnType<typeof getPublishedProducts>>['products'][number]): CardProduct {
  const firstVariant = p.variants[0];
  const firstImage = p.images[0];
  return {
    id: p.id,
    slug: p.handle,
    name: p.title,
    category: p.category?.name ?? 'Pashmina',
    material: p.description?.split('\n')[0] ?? 'Pashmina',
    price: firstVariant ? Number(firstVariant.price) : 0,
    image: firstImage?.thumbUrl || firstImage?.url || '/images/product-shawl.jpg',
    description: p.description ?? '',
    isNew: false,
    featured: false,
  };
}

export default async function Shop() {
  const { products } = await getPublishedProducts();
  const cardProducts = products.map(toCard);
  const categories = Array.from(new Set(['All Pashmina', ...cardProducts.map(p => p.category)]));

  return (
    <Suspense fallback={<main className="productPage"><div className="container"><p>Loading shop...</p></div></main>}>
      <ShopClient initialProducts={cardProducts} categories={categories} />
    </Suspense>
  );
}
