import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";

interface HoldInventoryRequest {
  method: "hold-inv";
  items: { sku: string; quantity: number }[];
}
interface UnHoldInventoryRequest {
  method: "restock-inv";
  items: { sku: string; quantity: number }[];
}

export async function POST(req: NextRequest) {
  const { method, items }: HoldInventoryRequest | UnHoldInventoryRequest =
    await req.json();
  // console.log("inv items: ", items); // these are the cart items
  // return NextResponse.json({ server: "pong" });

  if (method === "hold-inv") {
    // check that ALL items have sufficient stock
    const errorInv: { sku: string; availableInv: number }[] = [];
    const checkStockPromises: any[] = [];

    items.forEach((item) => {
      checkStockPromises.push(
        prisma.sizes_Inventory.findUnique({
          where: { sku: item.sku },
          select: {
            sku: true,
            inventory: true,
          },
        })
      );
      // else, push sku and "availableInv" into object for error
    });
    try {
      const dbResponses = await Promise.all(checkStockPromises);
      //
      // FOR EACH dbResponse, ADD any Insufficient Funds
      dbResponses.forEach((dbItem, i: number) => {
        let correspondingItem = items.find((item) => item.sku === dbItem?.sku);
        // if inventory is less than requested quantity OR if it will bring inventory below 0, add to error inv

        // could be NULL (product DNE anymore)
        if (!dbItem && !correspondingItem) {
          // if both undefined, means product DNE anymore
          // we want to send back (errorInv) with
          // {sku: items[i].sku, availableInv: 0}
          errorInv.push({
            sku: items[i].sku,
            availableInv: 0,
          });
        } else if (
          (dbItem?.inventory ?? 0) < (correspondingItem?.quantity ?? 0) ||
          (dbItem?.inventory ?? 0) - (correspondingItem?.quantity ?? 0) < 0
        ) {
          errorInv.push({
            sku: correspondingItem?.sku ?? "",
            availableInv: dbItem?.inventory ?? 0,
          });
        }
      }); // for each, add the errors
      //
      //
      if (errorInv.length !== 0) {
        // console.log("errorInv: ", errorInv);
        return NextResponse.json(
          { message: "insufficient inventory", stock: errorInv },
          { status: 500 }
        );
      } else {
        // now we know there's sufficient funds (synchonously..good)
        const decrPromises: any[] = [];
        items.forEach((item) => {
          decrPromises.push(
            prisma.sizes_Inventory.update({
              where: {
                sku: item.sku,
              },
              data: {
                inventory: { decrement: item.quantity },
              },
            })
          );
        }); // for each item, push in promise to decrement
        try {
          const decrResponses = await Promise.all(decrPromises);
          return NextResponse.json({ decrResponses });
        } catch (e) {
          return NextResponse.json({ errorDecrementing: e }, { status: 500 });
        }
      } // sufficient funds (end else statement)
    } catch (e) {
      // issue with checking available stock
      return NextResponse.json({ errorCheckingStock: e }, { status: 500 });
    }
  } else if (method === "restock-inv") {
    // If a transaction fails to go through, this will re-stock the products
    const incrPromises: any[] = [];
    items.forEach((item) => {
      incrPromises.push(
        prisma.sizes_Inventory.update({
          where: {
            sku: item.sku,
          },
          data: {
            inventory: { increment: item.quantity },
          },
        })
      );
    }); // for each item, push in promise to decrement
    try {
      const increResponses = await Promise.all(incrPromises);
      return NextResponse.json({ increResponses });
    } catch (e) {
      return NextResponse.json({ errorIncrementing: e }, { status: 500 });
    }
  } else {
    return NextResponse.json(
      { message: "didn't hit correct route.." },
      { status: 500 }
    );
  }
}
