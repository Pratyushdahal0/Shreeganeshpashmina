import { NextResponse } from "next/server";
import { z } from "zod";
import { hasAnyRole } from "@/lib/admin";
import { db } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
const schema = z.object({ key: z.enum(["business", "store", "shipping", "payments", "seo"]), value: z.record(z.string(), z.unknown()) });
export async function PATCH(request: Request) { if (!await hasAnyRole(["OWNER", "ADMIN", "MANAGER"])) return NextResponse.json({ error: "Forbidden" }, { status: 403 }); const parsed = schema.safeParse(await request.json()); const prisma = db(); if (!parsed.success || !prisma) return NextResponse.json({ error: "Invalid setting update." }, { status: 400 }); const value = parsed.data.value as Prisma.InputJsonValue; const setting = await prisma.storeSetting.upsert({ where: { key: parsed.data.key }, update: { value }, create: { key: parsed.data.key, value } }); return NextResponse.json(setting); }
