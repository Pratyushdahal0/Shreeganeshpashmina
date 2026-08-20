import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
const schema = z.object({ id: z.string().optional(), sectionKey: z.string().min(1), displayMode: z.enum(['TEXT_ONLY', 'IMAGE_ONLY', 'TEXT_OVER_IMAGE']), eyebrow: z.string().nullable(), headline: z.string().nullable(), subheadline: z.string().nullable(), bodyText: z.string().nullable(), imageUrl: z.string().nullable(), order: z.number().int(), isActive: z.boolean() });
export async function POST(request: Request) { if (!await isAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); const parsed = schema.safeParse(await request.json()); const prisma = db(); if (!parsed.success || !prisma) return NextResponse.json({ error: 'Invalid content block.' }, { status: 400 }); const { id, ...data } = parsed.data; const banner = id ? await prisma.banner.update({ where: { id }, data }) : await prisma.banner.create({ data }); return NextResponse.json(banner); }
