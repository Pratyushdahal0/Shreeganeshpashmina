import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import { canTransitionOrder, orderTransitions, type OrderLifecycleStatus } from "@/lib/order-status";

const schema = z.object({ status: z.enum(Object.keys(orderTransitions) as [OrderLifecycleStatus, ...OrderLifecycleStatus[]]), note: z.string().trim().max(1000).optional() });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid order update." }, { status: 400 });
  const prisma = db();
  if (!prisma) return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
  const order = await prisma.order.findUnique({ where: { id: (await params).id }, include: { items: { include: { variant: { include: { inventory: true } } } } } });
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  if (!canTransitionOrder(order.status, parsed.data.status)) return NextResponse.json({ error: `Cannot move an order from ${order.status} to ${parsed.data.status}.` }, { status: 409 });
  const updated = await prisma.$transaction(async (tx) => {
    if (parsed.data.status === "CANCELLED") {
      for (const item of order.items) if (item.variant?.inventory) { await tx.inventoryItem.update({ where: { id: item.variant.inventory.id }, data: { reserved: { decrement: item.quantity } } }); await tx.inventoryMovement.create({ data: { inventoryItemId: item.variant.inventory.id, type: "RELEASE", quantity: -item.quantity, reference: order.orderNumber, note: "Reservation released after cancellation." } }); }
    }
    if (parsed.data.status === "SHIPPED") {
      for (const item of order.items) if (item.variant?.inventory) { const inventory = item.variant.inventory; if (inventory.reserved < item.quantity || inventory.onHand < item.quantity) throw new Error("Inventory reservation is inconsistent."); await tx.inventoryItem.update({ where: { id: inventory.id }, data: { reserved: { decrement: item.quantity }, onHand: { decrement: item.quantity } } }); await tx.inventoryMovement.create({ data: { inventoryItemId: inventory.id, type: "SALE", quantity: -item.quantity, reference: order.orderNumber, note: "Stock fulfilled and shipped." } }); }
    }
    const next = await tx.order.update({ where: { id: order.id }, data: { status: parsed.data.status } });
    await tx.orderStatusHistory.create({ data: { orderId: order.id, status: parsed.data.status, note: parsed.data.note } });
    await tx.auditLog.create({ data: { action: "STATUS_CHANGE", entityType: "Order", entityId: order.id, before: { status: order.status }, after: { status: parsed.data.status } } });
    return next;
  });
  return NextResponse.json(updated);
}
