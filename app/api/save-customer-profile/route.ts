import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prismaClient";

interface CreateCustomerProfile {
  userId: string;
  customerProfileId: string;

  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export async function POST(req: NextRequest) {
  const data: CreateCustomerProfile = await req.json();

  const user = await prisma.customerProfile.create({
    data: {
      userId: data.userId,
      customerProfileId: data.customerProfileId,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
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
