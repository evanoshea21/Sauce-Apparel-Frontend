import { NextRequest, NextResponse } from "next/server";
import type { Product, ProductData } from "@/scripts/Types";
import prisma from "@/lib/prismaClient";

interface CreateProduct {
  method: "create";
  data: Product;
}
interface UpdateProduct {
  method: "update";
  productId: string;
  data: ProductData;
}
interface ReadProduct {
  method: "read";
  id?: string;
  name?: string;
  category?: string;
  isFeatured?: true;
}
interface DeleteProduct {
  id: string;
}

export async function POST(req: NextRequest) {
  const reqBody: CreateProduct | ReadProduct | UpdateProduct = await req.json();

  // CREATE
  if (reqBody.method === "create") {
    //DONE
    try {
      const productResponse = await prisma.products.create({
        data: {
          ...reqBody.data.product,
        },
      });

      // build the flavors_inventory array
      const flavorInventoryArr = [...reqBody.data.flavors_inventory];
      flavorInventoryArr.forEach((obj) => {
        // add productId from productResponse
        //idk if this VV works
        obj.productId = productResponse.id;
      });

      const flavorResponse = await prisma.flavors_Inventory.createMany({
        data: flavorInventoryArr,
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
    // IF name, category, isFeatured
    // const response = await prisma.products.findMany();
    const productResponse = await prisma.products.findMany({
      where: {
        id: reqBody.id,
        name: reqBody.name,
        category: reqBody.category,
        isFeatured: reqBody.isFeatured,
      },
    });
    // productResponse =
    let products: Product[] = [];
    // for each of these products, run a query to tack on the flavors_inventories
    for (let i = 0; i < productResponse.length; i++) {
      let productId = productResponse[i].id;
      const flavors_inventoryResponse = await prisma.flavors_Inventory.findMany(
        {
          where: { productId },
        }
      );
      const flavors_inventory = flavors_inventoryResponse;
      const product: Product = {
        product: productResponse[i],
        flavors_inventory,
      };

      products.push(product);
    }

    return NextResponse.json(products);
  }
  // UPDATE
  if (reqBody.method === "update") {
    try {
      const response = await prisma.products.update({
        where: { id: reqBody.productId },
        data: reqBody.data,
      });
      return NextResponse.json({ response });
    } catch (e) {
      console.log("error updating product: \n", e);
      return NextResponse.json({ error: e }, { status: 500 });
    }
  }
}

export async function DELETE(req: NextRequest) {
  // TODO
  const reqBody: DeleteProduct = await req.json();

  try {
    const flavorResponse = await prisma.flavors_Inventory.deleteMany({
      where: {
        productId: reqBody.id,
      },
    });
    const productResponse = await prisma.products.delete({
      where: {
        id: reqBody.id,
      },
    });
    return NextResponse.json({ productResponse, flavorResponse });
  } catch (e) {
    console.log("Error deleting product and/or flavors: ", e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
