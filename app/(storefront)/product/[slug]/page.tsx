import { notFound } from 'next/navigation';
import { getProductByHandle } from '@/lib/actions/products';
import { getApprovedReviews } from '@/lib/actions/reviews';
import ProductDetailClient from './ProductDetailClient';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { product } = await getProductByHandle(resolvedParams.slug);

  if (!product || product.status !== 'PUBLISHED') {
    notFound();
  }

  const { reviews } = await getApprovedReviews(product.id);

  const firstVariant = product.variants[0];
  const firstImage = product.images[0];

  const formattedProduct = {
    id: product.id,
    slug: product.handle,
    name: product.title,
    category: product.category?.name ?? 'Pashmina',
    material: product.description?.split('\n')[0] ?? 'Pashmina',
    price: firstVariant ? Number(firstVariant.price) : 0,
    image: firstImage?.url ?? '/images/product-shawl.jpg',
    description: product.description ?? '',
    images: product.images.length > 0 ? product.images.map(img => img.url) : ['/images/product-shawl.jpg'],
  };

  return <ProductDetailClient product={formattedProduct} initialReviews={reviews} />;
}
