import { NextRequest, NextResponse } from "next/server";
import type { ProductStock } from "@/scripts/Types";
import prisma from "@/lib/prismaClient";
import ProductItem from "@/app/components/ProductItem";

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
    const uniqueProducts: { [key: string]: any } = {};

    try {
      response = await prisma.products.findMany();

      response.forEach((product) => {
        if (uniqueProducts[product.name] === undefined) {
          //add the product by name
          uniqueProducts[product.name] = product;
          // grab flavor, push in array under propName flavors
          uniqueProducts[product.name].ids = [uniqueProducts[product.name].id];
          uniqueProducts[product.name].flavors = [
            uniqueProducts[product.name].flavor,
          ];
          // delete old single property Flavor, and itemId
          delete uniqueProducts[product.name].id;
          delete uniqueProducts[product.name].flavor;
        } else {
          //push in the flavor, and itemId
          uniqueProducts[product.name].ids.push(product.id);
          uniqueProducts[product.name].flavors.push(product.flavor);
        }
      });

      return NextResponse.json({ data: Object.values(uniqueProducts) });
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
        where: { id: reqBody.data.id },
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
  const reqBody = await req.json();
  try {
    const response = await prisma.products.deleteMany({
      where: {
        name: reqBody.name,
      },
    });
    console.log("delete response: ", response);

    return NextResponse.json({ data: response }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
