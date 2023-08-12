import { NextRequest, NextResponse } from "next/server";
import type { Order, PurchasedItem } from "@/scripts/Types";
import prisma from "@/lib/prismaClient";

export interface SaveOrderReq {
  method: "save-order";
  order: Order;
  purchasedItems: PurchasedItem[];
}
export interface GetOrderReq {
  method: "get-orders";
  refTransId?: string;
  userId?: string;
  fromDate?: Date;
}

export async function POST(req: NextRequest) {
  const reqBody: SaveOrderReq | GetOrderReq = await req.json();

  if (reqBody.method === "save-order") {
    const dbResOrder = await prisma.orders.create({
      data: {
        ...reqBody.order,
      },
    });

    const purchases: PurchasedItem[] = [...reqBody.purchasedItems];
    purchases.forEach((purchase) => {
      delete purchase.maxQuantity;
      purchase.refTransId = reqBody.order.refTransId;
    });

    const dbResItems = await prisma.purchasedItems.createMany({
      data: purchases,
    });
    return NextResponse.json({ dbResOrder, dbResItems });
  } else {
    return NextResponse.json({ message: "oops, not saving" });
  }
}
