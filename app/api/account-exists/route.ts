import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json(
    { error: "Customer accounts are not available." },
    { status: 404 },
  );
}
