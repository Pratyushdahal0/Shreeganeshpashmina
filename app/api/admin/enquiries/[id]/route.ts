import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
const schema = z.object({ status: z.enum(['NEW', 'CONTACTED', 'CLOSED']) });
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) { if (!await isAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); const parsed = schema.safeParse(await request.json()); const prisma = db(); if (!parsed.success || !prisma) return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); return NextResponse.json(await prisma.enquiry.update({ where: { id: (await params).id }, data: parsed.data })); }
