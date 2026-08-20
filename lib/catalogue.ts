import {
  products as fallbackProducts,
  type Product as FallbackProduct,
} from "@/lib/data";
import { db } from "@/lib/prisma";

export type CatalogueProduct = FallbackProduct & {
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImageUrl?: string | null;
  keywords?: string[];
  canonicalUrl?: string | null;
};
export async function catalogue(): Promise<CatalogueProduct[]> {
  const prisma = db();
  if (!prisma) return fallbackProducts;
  try {
    const rows = await prisma.product.findMany({
      orderBy: { createdAt: "asc" },
    });
    return rows.length
      ? rows.map((row) => ({ ...row, new: row.isNew }))
      : fallbackProducts;
  } catch {
    return fallbackProducts;
  }
}
export async function productBySlug(slug: string): Promise<CatalogueProduct> {
  return (
    (await catalogue()).find((product) => product.slug === slug) ??
    fallbackProducts[0]
  );
}
