import { catalogue } from "@/lib/catalogue";
import { db } from "@/lib/prisma";
import ProductEditor from "@/components/ProductEditor";
import VariantManager from "@/components/VariantManager";
import { notFound } from "next/navigation";
export const dynamic = 'force-dynamic';
export default async function ProductEditPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const product = (await catalogue()).find((item) => item.id === id); if (!product) notFound(); const prisma = db(); const variants = prisma ? await prisma.productVariant.findMany({ where: { productId: id }, include: { inventory: true }, orderBy: { createdAt: "asc" } }) : []; return <><div className="sectionHead"><div><div className="eyebrow">Catalogue</div><h2>Edit {product.name}</h2></div></div><ProductEditor product={product} /><VariantManager productId={id} variants={variants} /></>; }
