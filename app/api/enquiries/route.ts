import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/prisma";
import { whatsappUrl } from "@/lib/whatsapp";

const schema = z.object({ type: z.enum(["CART", "PRODUCT", "CONTACT"]), customerName: z.string().trim().min(1).max(100), customerEmail: z.string().email().optional().or(z.literal("")), customerPhone: z.string().max(30).optional(), productIds: z.array(z.string()).default([]), message: z.string().max(2000).optional(), currency: z.string().min(3).max(3), region: z.string().max(80).optional() });
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Please complete the required enquiry details." }, { status: 400 });
  const data = parsed.data;
  const prisma = db();
  if (!prisma) return NextResponse.json({ error: "Enquiries are not configured yet." }, { status: 503 });
  await prisma.$transaction(async (tx) => {
    await tx.enquiry.create({ data: { ...data, customerEmail: data.customerEmail || null } });
    if (data.customerPhone?.trim()) {
      const productId = data.productIds.length === 1 && await tx.product.findUnique({ where: { id: data.productIds[0] }, select: { id: true } }) ? data.productIds[0] : null;
      await tx.whatsAppInquiry.create({ data: { customerName: data.customerName, phone: data.customerPhone.trim(), email: data.customerEmail || null, productId, message: data.message, notes: `Captured from ${data.type.toLowerCase()} enquiry.` } });
    }
  });
  return NextResponse.json({ whatsappUrl: whatsappUrl(data.message || "Hello Shree Ganesh Pashmina, I have an enquiry.") });
}
