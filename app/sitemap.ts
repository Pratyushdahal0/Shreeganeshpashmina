import type { MetadataRoute } from "next";
import { catalogue } from "@/lib/catalogue";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> { const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://shree-ganeshpashmina.vercel.app'; const products = await catalogue(); return ['/', '/shop', '/craft', '/story', '/contact'].map((path) => ({ url: `${base}${path}`, lastModified: new Date() })).concat(products.map((product) => ({ url: `${base}/product/${product.slug}`, lastModified: new Date() }))); }
