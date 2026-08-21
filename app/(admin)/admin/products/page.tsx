import ProductList from '@/components/admin/products/ProductList';
import { productCategories, productService } from '@/lib/admin/products';

export default async function ProductsPage() { const { products } = await productService.list(); return <ProductList products={products} categories={productCategories} />; }
