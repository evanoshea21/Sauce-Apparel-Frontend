import { NextRequest, NextResponse } from "next/server";
import type { ProductStock } from "@/scripts/Types";
import prisma from "@/lib/prismaClient";
import ProductItem from "@/app/components/ProductItem";

export async function POST(req: NextRequest) {
  const reqBody = await req.json();
  console.log("reqBody /flavor: ", reqBody);
  return NextResponse.json({ server: "pong post" });
}
export async function DELETE(req: NextRequest) {
  const reqBody = await req.json();
  console.log("reqBody /flavor/delete: ", reqBody);

  return NextResponse.json({ server: "pong delete" });
}
