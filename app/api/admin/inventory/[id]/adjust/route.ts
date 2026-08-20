import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";

const schema = z.object({ quantity: z.number().int().min(-100000).max(100000).refine((value) => value !== 0), reason: z.string().trim().min(3).max(300) });
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Enter a non-zero adjustment and a reason." }, { status: 400 });
  const prisma = db();
  if (!prisma) return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
  const inventoryId = (await params).id;
  try {
    const result = await prisma.$transaction(async (tx) => {
      const current = await tx.inventoryItem.findUnique({ where: { id: inventoryId } });
      if (!current) throw new Error("NOT_FOUND");
      const nextOnHand = current.onHand + parsed.data.quantity;
      if (nextOnHand < current.reserved) throw new Error("INSUFFICIENT");
      const inventory = await tx.inventoryItem.update({ where: { id: inventoryId }, data: { onHand: nextOnHand } });
      const movement = await tx.inventoryMovement.create({ data: { inventoryItemId: inventoryId, type: "ADJUSTMENT", quantity: parsed.data.quantity, note: parsed.data.reason } });
      await tx.auditLog.create({ data: { action: "INVENTORY_ADJUSTMENT", entityType: "InventoryItem", entityId: inventoryId, before: { onHand: current.onHand }, after: { onHand: nextOnHand, reason: parsed.data.reason } } });
      return { inventory, movement };
    });
    return NextResponse.json(result);
  } catch (error) { const code = error instanceof Error ? error.message : ""; return NextResponse.json({ error: code === "INSUFFICIENT" ? "Stock cannot fall below reserved quantity." : "Inventory item not found." }, { status: code === "INSUFFICIENT" ? 409 : 404 }); }
}
