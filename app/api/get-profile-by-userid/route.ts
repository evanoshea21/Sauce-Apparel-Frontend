import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  const user = await prisma.customerProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!user) {
    return NextResponse.json("user DNE", { status: 500 });
  }

  return NextResponse.json(user);
}
