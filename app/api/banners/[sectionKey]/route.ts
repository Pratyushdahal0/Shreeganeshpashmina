import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
export async function GET(_: Request, { params }: { params: Promise<{ sectionKey: string }> }) { const prisma = db(); if (!prisma) return NextResponse.json({ banner: null }); const banner = await prisma.banner.findFirst({ where: { sectionKey: (await params).sectionKey, isActive: true } }); return NextResponse.json({ banner }); }
