import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";

export async function POST(req: NextRequest) {
  const reqBody = await req.json();

  console.log("POST /api/flavor: \n", reqBody);

  return NextResponse.json({ server: "pong for post flavor" });
}

export async function DELETE(req: NextRequest) {
  const reqBody = await req.json();

  console.log("DELETE /api/flavor: \n", reqBody);

  return NextResponse.json({ server: "pong for delete flavor" });
}
