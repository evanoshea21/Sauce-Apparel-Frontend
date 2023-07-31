import { NextRequest, NextResponse } from "next/server";
// import type { Product } from "@/scripts/Types";
import prisma from "@/lib/prismaClient";

interface Flavors_Inventory {
  flavor: string;
  inventory: number;
  salesPrice: string | null;
  productId: string; // returns for READ; for CREATE, pass empty string
}
interface CreateFlavorsAndInventory {
  method: "create";
  data: Flavors_Inventory[];
}
interface ReadFlavorsAndInventory {
  method: "read";
  productId: string;
}
interface UpdateInventory {
  method: "update_inventory";
  productId: string;
  flavor: string;
  newInventory: number;
}
interface DeleteFlavor {
  productId: string;
  flavor: string;
}

export async function POST(req: NextRequest) {
  const reqBody:
    | CreateFlavorsAndInventory
    | ReadFlavorsAndInventory
    | UpdateInventory = await req.json();

  if (reqBody.method === "create") {
    try {
      const response = await prisma.flavors_Inventory.createMany({
        data: reqBody.data,
      });
      return NextResponse.json({ response });
    } catch (e) {
      console.log("Error create flavor: \n", e);
      return NextResponse.json({ error: e }, { status: 500 });
    }
  }
  if (reqBody.method === "read") {
    // don't really need this.. except for smaller payload to refresh row maybe
    try {
      const response = await prisma.flavors_Inventory.findMany({
        where: {
          productId: reqBody.productId,
        },
      });
      return NextResponse.json(response);
    } catch (e) {
      console.log("Error reading flavors: \n", e);
      return NextResponse.json({ error: e }, { status: 500 });
    }
  }
  if (reqBody.method === "update_inventory") {
    try {
      const response = await prisma.flavors_Inventory.update({
        where: {
          productId_flavor: {
            productId: reqBody.productId,
            flavor: reqBody.flavor,
          },
        },
        data: {
          inventory: reqBody.newInventory,
        },
      });
      return NextResponse.json(response);
    } catch (e) {
      console.log("Error updating flavor's inventory: \n", e);
      return NextResponse.json({ error: e }, { status: 500 });
    }
  }
}
export async function DELETE(req: NextRequest) {
  const reqBody: DeleteFlavor = await req.json();
  // console.log("reqBody /flavor/delete: ", reqBody);

  try {
    const response = await prisma.flavors_Inventory.delete({
      where: {
        productId_flavor: {
          productId: reqBody.productId,
          flavor: reqBody.flavor,
        },
      },
    });
    return NextResponse.json({ response });
  } catch (e) {
    console.log("Error deleting flavor: \n", e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
