import ProductEditor from '@/components/admin/products/ProductEditor';
import { getCollections } from '@/lib/actions/collections';

export default async function NewProductPage() {
  const { collections } = await getCollections();
  const formattedCategories = (collections || []).map((c) => ({ id: c.id, name: c.name }));

  return <ProductEditor categories={formattedCategories} />;
}
