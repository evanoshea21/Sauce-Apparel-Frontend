import { NextRequest, NextResponse } from "next/server";
import type { Categories, Product, ProductData } from "@/scripts/Types";
import prisma from "@/lib/prismaClient";

type ProductAlone = Omit<Product, "Sizes_Inventory">;
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
  fullProduct?: boolean;
  excludeOutOfStock?: boolean;
  id?: string;
  name?: string;
  category?: Categories;
  isFeatured?: true;
}
interface DeleteProduct {
  id: string;
}

export async function POST(req: NextRequest) {
  // return NextResponse.json([]);
  const reqBody: CreateProduct | ReadProduct | UpdateProduct = await req.json();

  // CREATE
  if (reqBody.method === "create") {
    //DONE

    const data: Product = { ...reqBody.data };
    delete data.Sizes_Inventory;
    const newData: ProductAlone = data;

    try {
      const productResponse = await prisma.products.create({
        data: {
          ...newData,
        },
      });

      // build the sizes_inventory array
      const sizeInventoryArr = [...(reqBody.data.Sizes_Inventory ?? [])];
      sizeInventoryArr.forEach((obj) => {
        // add productId from productResponse
        obj.productId = productResponse.id;
      });

      const sizeResponse = await prisma.sizes_Inventory.createMany({
        data: sizeInventoryArr,
      });

      return NextResponse.json({
        response: { productResponse, sizeResponse },
      });
    } catch (e) {
      console.log("error creating product: \n", e);
      return NextResponse.json({ error: e }, { status: 500 });
    }
  }
  // READ
  if (reqBody.method === "read") {
    // if don't need to exclude, nor full product
    if (!reqBody.excludeOutOfStock && !reqBody.fullProduct) {
      const productResponse = await prisma.products.findMany({
        where: {
          id: reqBody.id,
          name: reqBody.name,
          category: reqBody.category,
          isFeatured: reqBody.isFeatured,
        },
      });
      return NextResponse.json(productResponse);
    } else {
      const productResponse = await prisma.products.findMany({
        where: {
          id: reqBody.id,
          name: reqBody.name,
          category: reqBody.category,
          isFeatured: reqBody.isFeatured,
        },
        include: {
          Sizes_Inventory: true,
        },
      });
      if (reqBody.excludeOutOfStock) {
        // loop through and filter out those with empty sizes
        const filteredResponse = productResponse.filter((product) => {
          return (
            product.Sizes_Inventory != undefined &&
            product.Sizes_Inventory.length != 0
          );
        });
        return NextResponse.json(filteredResponse);
      } else {
        return NextResponse.json(productResponse);
      }
    }
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
    const sizeResponse = await prisma.sizes_Inventory.deleteMany({
      where: {
        productId: reqBody.id,
      },
    });
    const productResponse = await prisma.products.delete({
      where: {
        id: reqBody.id,
      },
    });
    return NextResponse.json({ productResponse, sizeResponse });
  } catch (e) {
    console.log("Error deleting product and/or sizes: ", e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
