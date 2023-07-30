import { NextRequest, NextResponse } from "next/server";
import type { ProductStock } from "@/scripts/Types";
import prisma from "@/lib/prismaClient";
import ProductItem from "@/app/components/ProductItem";

interface CreateProduct {
  method: "create";
  data: {
    product: {
      name: string;
      unitPrice: string;
      imageUrl: string;

      description?: string;
      salesPrice?: string;
      category?: string;
      isFeatured: boolean;
      inventory: number;
    };
    flavors_stock: { flavor: string; inventory: number; salesPrice?: string }[];
  };
}

export async function POST(req: NextRequest) {
  const reqBody = await req.json();
  console.log("reqBody /product: ", reqBody);

  // CREATE
  if (reqBody.method === "create") {
    try {
      const productResponse = await prisma.products.create({
        data: {
          ...reqBody.data.product,
        },
      });
      console.log("productResponse(get id): \n", productResponse);

      // build the flavors_inventory array
      const flavorInventoryArr: {
        flavor: string;
        inventory: number;
        productId: string;
        salesPrice?: string;
      }[] = [...reqBody.data.flavors_stock];
      flavorInventoryArr.forEach((obj) => {
        // add productId from productResponse
        //idk if this VV works
        obj.productId = productResponse.id;
      });

      const flavorResponse = await prisma.flavors_Inventory.createMany({
        data: [...flavorInventoryArr],
      });

      return NextResponse.json({
        response: { productResponse, flavorResponse },
      });
    } catch (e) {
      console.log("error creating product: \n", e);
      return NextResponse.json({ error: e }, { status: 500 });
    }
  }
  // READ
  if (reqBody.method === "read") {
    // return NextResponse.json({ response });
  }
  // UPDATE
  if (reqBody.method === "update") {
    // return NextResponse.json({ response });
  }
}

export async function DELETE(req: NextRequest) {
  const reqBody = await req.json();
  console.log("reqBody /product/delete: ", reqBody);

  return NextResponse.json({ server: "pong delete" });
}
