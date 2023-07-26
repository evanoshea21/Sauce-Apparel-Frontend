import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const data = await req.json();

  console.log("data from save-customer-profile:\n", data);

  const user = await prisma.customerProfile.create({
    data: {
      userId: data.userId,
      customerProfileId: data.customerProfileId,
    },
  });

  return NextResponse.json({ prismaRowCreateResponse: user });
}
