import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prismaClient";

export async function POST(req: NextRequest) {
  const data = await req.json();

  const user = await prisma.customerProfile.create({
    data: {
      userId: data.userId,
      customerProfileId: data.customerProfileId,
    },
  });

  return NextResponse.json({ prismaRowCreateResponse: user });
}

export async function DELETE(req: NextRequest) {
  const data = await req.json();

  console.log("data from save-customer-profile DELETE:\n", data);

  const deleteUser = await prisma.customerProfile.delete({
    where: {
      customerProfileId: data.customerProfileId,
    },
  });

  return NextResponse.json({ prismaRowCreateResponse: deleteUser });
}
