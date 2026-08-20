import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";

const schema = z.object({ customerName: z.string().trim().min(2).max(120), email: z.string().email().optional().or(z.literal("")), phone: z.string().trim().max(30).optional().or(z.literal("")), items: z.array(z.object({ variantId: z.string().min(1), quantity: z.number().int().min(1).max(1000) })).min(1).max(50), note: z.string().trim().max(1000).optional() });

export async function POST(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success || (!parsed.data.email && !parsed.data.phone)) return NextResponse.json({ error: "Add a customer email or phone, and at least one item." }, { status: 400 });
  const prisma = db();
  if (!prisma) return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
  try {
    const order = await prisma.$transaction(async (tx) => {
      const email = parsed.data.email || null; const phone = parsed.data.phone || null;
      const customer = email ? await tx.customer.upsert({ where: { email }, update: { name: parsed.data.customerName, phone: phone || undefined }, create: { name: parsed.data.customerName, email, phone } }) : await tx.customer.upsert({ where: { phone: phone! }, update: { name: parsed.data.customerName }, create: { name: parsed.data.customerName, phone } });
      const variants = await tx.productVariant.findMany({ where: { id: { in: parsed.data.items.map((item) => item.variantId) }, isActive: true }, include: { product: true, inventory: true } });
      if (variants.length !== parsed.data.items.length) throw new Error("VARIANT");
      let subtotalMinor = 0;
      const items = parsed.data.items.map((item) => { const variant = variants.find((row) => row.id === item.variantId)!; const unitPriceMinor = variant.priceMinor ?? variant.product.priceMinor ?? Math.round(variant.product.price * 100); subtotalMinor += unitPriceMinor * item.quantity; return { variant, quantity: item.quantity, unitPriceMinor }; });
      for (const item of items) { const inventory = item.variant.inventory; if (!inventory) throw new Error("INVENTORY"); const available = inventory.onHand - inventory.reserved; if (!item.variant.product.allowBackorder && available < item.quantity) throw new Error("STOCK"); await tx.inventoryItem.update({ where: { id: inventory.id }, data: { reserved: { increment: item.quantity } } }); await tx.inventoryMovement.create({ data: { inventoryItemId: inventory.id, type: "RESERVATION", quantity: item.quantity, reference: "ORDER_RESERVATION", note: "Reserved for new order." } }); }
      const orderNumber = `SGP-${Date.now().toString().slice(-9)}`;
      const created = await tx.order.create({ data: { orderNumber, customerId: customer.id, source: "ADMIN", status: "PENDING", paymentStatus: "PENDING", subtotalMinor, totalMinor: subtotalMinor, internalNote: parsed.data.note, items: { create: items.map((item) => ({ productId: item.variant.productId, variantId: item.variant.id, title: `${item.variant.product.name} — ${item.variant.title}`, sku: item.variant.sku, quantity: item.quantity, unitPriceMinor: item.unitPriceMinor, totalMinor: item.unitPriceMinor * item.quantity })) }, statusHistory: { create: { status: "PENDING", note: "Manual order created." } } } });
      await tx.auditLog.create({ data: { action: "CREATE", entityType: "Order", entityId: created.id, after: { orderNumber: created.orderNumber, totalMinor: subtotalMinor } } });
      return created;
    });
    return NextResponse.json(order, { status: 201 });
  } catch (error) { const code = error instanceof Error ? error.message : ""; const message = code === "STOCK" ? "One or more variants do not have enough available stock." : code === "VARIANT" ? "One or more selected variants are unavailable." : "Unable to create the order."; return NextResponse.json({ error: message }, { status: 409 }); }
}
