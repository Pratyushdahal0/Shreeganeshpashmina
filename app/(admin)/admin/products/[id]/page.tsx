import { notFound } from 'next/navigation';
import ProductEditor from '@/components/admin/products/ProductEditor';
import { productService } from '@/lib/admin/products';
import { getCollections } from '@/lib/actions/collections';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await productService.get(id);
  const { collections } = await getCollections();

  if (!product) notFound();

  const formattedCategories = (collections || []).map((c) => ({ id: c.id, name: c.name }));

  return <ProductEditor product={product} categories={formattedCategories} />;
}
