import { notFound } from 'next/navigation';
import ProductEditor from '@/components/admin/products/ProductEditor';
import { productService } from '@/lib/admin/products';
export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) { const product = await productService.get((await params).id); if (!product) notFound(); return <ProductEditor product={product} />; }
