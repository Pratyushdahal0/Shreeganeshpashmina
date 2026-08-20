import type { Metadata } from "next";
import ProductDetail from "@/components/ProductDetail";
import { productBySlug } from "@/lib/catalogue";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = await productBySlug((await params).slug);
  const title = product.metaTitle || `${product.name} | Shree Ganesh Pashmina`;
  const description = product.metaDescription || product.description;
  const canonical = product.canonicalUrl || `/product/${product.slug}`;
  const image = product.ogImageUrl || product.image;
  return { title, description, keywords: product.keywords, alternates: { canonical }, openGraph: { title, description, images: [image], type: 'website' }, twitter: { card: 'summary_large_image', title, description, images: [image] } };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  return <ProductDetail product={await productBySlug((await params).slug)} />;
}
