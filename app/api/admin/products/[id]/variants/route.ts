import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";

const schema = z.object({ sku: z.string().trim().min(2).max(80), title: z.string().trim().min(1).max(120), openingStock: z.number().int().min(0).max(100000), priceMinor: z.number().int().nonnegative().optional(), attributes: z.record(z.string(), z.string()).optional() });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Review the variant details." }, { status: 400 });
  const prisma = db();
  if (!prisma) return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
  const productId = (await params).id;
  if (!await prisma.product.findUnique({ where: { id: productId }, select: { id: true } })) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  try {
    const variant = await prisma.$transaction(async (tx) => {
      const created = await tx.productVariant.create({ data: { productId, sku: parsed.data.sku, title: parsed.data.title, attributes: parsed.data.attributes, priceMinor: parsed.data.priceMinor } });
      const inventory = await tx.inventoryItem.create({ data: { variantId: created.id, onHand: parsed.data.openingStock } });
      if (parsed.data.openingStock) await tx.inventoryMovement.create({ data: { inventoryItemId: inventory.id, type: "ADJUSTMENT", quantity: parsed.data.openingStock, reference: "OPENING_STOCK", note: "Opening stock created with variant." } });
      await tx.auditLog.create({ data: { action: "CREATE", entityType: "ProductVariant", entityId: created.id, after: { sku: created.sku, openingStock: parsed.data.openingStock } } });
      return { ...created, inventory };
    });
    return NextResponse.json(variant, { status: 201 });
  } catch { return NextResponse.json({ error: "A variant with this SKU already exists." }, { status: 409 }); }
}
