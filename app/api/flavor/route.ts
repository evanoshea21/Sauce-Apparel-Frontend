import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";

export async function POST(req: NextRequest) {
  const reqBody = await req.json();
  // console.log("POST /api/flavor: \n", reqBody);

  if (reqBody.method === "create") {
    // create array of all objects
    const productArr: any[] = [];
    reqBody.data.flavors.forEach((flavor: string) => {
      let obj = { ...reqBody.data };
      delete obj.flavors;
      obj.flavor = flavor;
      productArr.push(obj);
    });
    // run a create many prisma request
    // console.log("Create many: \n", productArr);
    try {
      const response = await prisma.products.createMany({
        data: productArr,
      });
      console.log("createMany res: \n", response);
      return NextResponse.json({ response });
    } catch (e) {
      return NextResponse.json({ error: e }, { status: 500 });
    }
  } else if (reqBody.method === "update") {
    console.log("update body: ", reqBody.data);

    let reqBodyData: {
      name: string;
      oldFlavor: string;
      newFlavor: string;
    } = reqBody.data;

    try {
      const response = await prisma.products.update({
        where: {
          name_flavor: {
            name: reqBodyData.name,
            flavor: reqBodyData.oldFlavor,
          },
        },
        data: {
          flavor: reqBodyData.newFlavor,
        },
      });

      return NextResponse.json({ response });
    } catch (e) {
      console.log("E updating flavor: \n", e);

      return NextResponse.json({ error: e }, { status: 500 });
    }
  }
}

export async function DELETE(req: NextRequest) {
  const reqBody = await req.json();

  console.log("DELETE /api/flavor: \n", reqBody);

  try {
    const response = await prisma.products.delete({
      where: {
        id: reqBody.id,
      },
    });
    return NextResponse.json({ response });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
