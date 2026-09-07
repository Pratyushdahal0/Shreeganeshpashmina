import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductByHandle } from '@/lib/actions/products';
import { getApprovedReviews } from '@/lib/actions/reviews';
import ProductDetailClient from './ProductDetailClient';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { product } = await getProductByHandle(resolvedParams.slug);

  if (!product || product.status !== 'PUBLISHED') {
    return {
      title: 'Product Not Found | Shree Ganesh Pashmina',
    };
  }

  const title = `${product.title} — Premium Handcrafted Pashmina | Shree Ganesh Pashmina`;
  const description =
    product.description?.slice(0, 160) ||
    `Discover ${product.title}, handcrafted in Kathmandu, Nepal. Authentic Pashmina, Cashmere, and luxury textiles.`;
  const image = product.images[0]?.url || '/images/product-shawl.jpg';

  return {
    title,
    description,
    keywords: [
      product.title,
      product.category?.name || 'Pashmina',
      'Handcrafted Pashmina',
      'Kathmandu Pashmina',
      'Cashmere Shawls Nepal',
      'Luxury Textiles',
    ],
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://shreeganeshpashmina.com/product/${product.handle}`,
      images: [{ url: image, alt: product.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

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
    thumbs: product.images.length > 0 ? product.images.map(img => img.thumbUrl || img.url) : ['/images/product-shawl.jpg'],
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: formattedProduct.images,
    description: formattedProduct.description,
    sku: firstVariant?.sku || product.handle,
    offers: {
      '@type': 'Offer',
      url: `https://shreeganeshpashmina.com/product/${product.handle}`,
      priceCurrency: 'USD',
      price: formattedProduct.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        firstVariant && firstVariant.inventory > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={formattedProduct} initialReviews={reviews} />
    </>
  );
}
