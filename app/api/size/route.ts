import { NextRequest, NextResponse } from "next/server";
// import type { Product } from "@/scripts/Types";
import prisma from "@/lib/prismaClient";

interface Sizes_Inventory {
  size: string;
  inventory: number;
  salesPrice: string | null;
  productId: string; // returns for READ; for CREATE, pass empty string
}
interface CreateSizesAndInventory {
  method: "create";
  data: Sizes_Inventory[];
}
interface ReadSizesAndInventory {
  method: "read";
  productId: string;
}
interface UpdateInventory {
  method: "update_inventory";
  productId: string;
  sizeUpdates: { [key: string]: number };
}
interface DeleteSize {
  productId: string;
  size: string;
}

export async function POST(req: NextRequest) {
  const reqBody:
    | CreateSizesAndInventory
    | ReadSizesAndInventory
    | UpdateInventory = await req.json();

  if (reqBody.method === "create") {
    try {
      const response = await prisma.sizes_Inventory.createMany({
        data: reqBody.data,
      });
      return NextResponse.json({ response });
    } catch (e) {
      console.log("Error create size: \n", e);
      return NextResponse.json({ error: e }, { status: 500 });
    }
  }
  if (reqBody.method === "read") {
    // don't really need this.. except for smaller payload to refresh row maybe
    try {
      const response = await prisma.sizes_Inventory.findMany({
        where: {
          productId: reqBody.productId,
        },
      });
      return NextResponse.json(response);
    } catch (e) {
      console.log("Error reading sizes: \n", e);
      return NextResponse.json({ error: e }, { status: 500 });
    }
  }
  if (reqBody.method === "update_inventory") {
    try {
      // cycle through all sizeUpdates
      const sizeUpdates = reqBody.sizeUpdates;
      let responseArr = [];
      for (let size in sizeUpdates) {
        const response = await prisma.sizes_Inventory.update({
          where: {
            productId_size: {
              productId: reqBody.productId,
              size,
            },
          },
          data: {
            inventory: sizeUpdates[size],
          },
        });
        responseArr.push(response);
      }
      return NextResponse.json({ response: responseArr });
    } catch (e) {
      console.log("Error updating size's inventory: \n", e);
      return NextResponse.json({ error: e }, { status: 500 });
    }
  }
}
export async function DELETE(req: NextRequest) {
  const reqBody: DeleteSize = await req.json();
  // console.log("reqBody /size/delete: ", reqBody);

  try {
    const response = await prisma.sizes_Inventory.delete({
      where: {
        productId_size: {
          productId: reqBody.productId,
          size: reqBody.size,
        },
      },
    });
    return NextResponse.json({ response });
  } catch (e) {
    console.log("Error deleting size: \n", e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
