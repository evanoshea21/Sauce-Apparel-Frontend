import { NextRequest, NextResponse } from "next/server";
import type { ProductStock } from "@/scripts/Types";
import prisma from "@/lib/prismaClient";

interface CreatePayload {
  method: "create";
  data: ProductStock;
}
interface ReadPayload {
  method: "read";
  data: { category: string };
}
interface UpdatePayload {
  method: "update";
  data: { [key: string]: any };
}
type PostBody = CreatePayload | ReadPayload | UpdatePayload;

export async function POST(req: NextRequest) {
  const reqBody = await req.json();
  let response;

  if (reqBody.method === "read") {
    try {
      response = await prisma.products.findMany();
      return NextResponse.json({ data: response });
    } catch (err) {
      console.log("error read: ", err);
      return NextResponse.json({ err }, { status: 500 });
    }
  } else if (reqBody.method === "create") {
    try {
      response = await prisma.products.create({ data: reqBody.data });
      return NextResponse.json({ data: response });
    } catch (err) {
      console.log("error create: ", err);
      return NextResponse.json({ err }, { status: 500 });
    }
  } else if (reqBody.method === "update") {
    try {
      response = await prisma.products.updateMany({
        where: { itemId: reqBody.data.itemId },
        data: { name: "Updated Name" },
      });
      return NextResponse.json({ data: response });
    } catch (err) {
      console.log("error update: ", err);
      return NextResponse.json({ err }, { status: 500 });
    }
  }
}

export async function DELETE(req: NextRequest) {
  const data = await req.json();
  console.log("data /products/POST: ", data);

  return NextResponse.json({ server: "Pong" });
}
