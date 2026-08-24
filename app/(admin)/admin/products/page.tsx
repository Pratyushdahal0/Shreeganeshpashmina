import ProductList from '@/components/admin/products/ProductList';
import { getProducts } from '@/lib/actions/products';
import { getCollections } from '@/lib/actions/collections';

export default async function ProductsPage() { 
  const { products } = await getProducts();
  const { collections } = await getCollections();
  
  // Extract category names for the filter
  const categories = collections?.map(c => c.name) || [];
  
  return <ProductList products={products || []} categories={categories} />; 
}
