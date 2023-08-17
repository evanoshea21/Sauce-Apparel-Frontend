"use client";
import React from "react";
import axios from "axios";
import classes from "@/styles/CheckoutBox.module.css";
import type {
  CartItem,
  Order,
  PurchasedItem,
  ChargeCardData,
} from "@/scripts/Types";
import type { Screens } from "./index";
import type { GuestPayment } from "./paymentComponents/GuestCard";
import {
  clearCartItems,
  getCartItems,
  getCartSumAndCount,
  roundPrice,
} from "../../utils";
import LockIcon from "@mui/icons-material/Lock";
import type { Payment } from "./index";
import { SaveOrderReq } from "@/app/api/orders/route";
import { useSession } from "next-auth/react";
import { Context } from "@/app/Context";

const TAX_PERCENT = Number(process.env.NEXT_PUBLIC_STATE_TAX_AS_DECIMAL);

export interface InvIssues {
  sku: string;
  availableInv: number;
}

interface Props {
  customerProfileId: string;
  payment: Payment | undefined;
  guestPayment: GuestPayment | undefined;
  refreshCart: boolean;
  setInvIssues: React.Dispatch<React.SetStateAction<InvIssues[] | undefined>>;
  setScreen: React.Dispatch<React.SetStateAction<Screens>>;
}
interface ChargeProfileDataToSend {
  customerProfileId: string;
  customerPaymentProfileId: string;
  order: {
    invoiceNumber: string; // INV-??
    description?: string; // online order
  };
  ordered_items: CartItem[];
  amountToCharge: number;
}

export default function CheckoutBtn({
  customerProfileId,
  payment,
  guestPayment,
  refreshCart,
  setInvIssues,
  setScreen,
}: Props) {
  const { data: session, status } = useSession();
  const globals = React.useContext(Context);

  const [purchaseResponse, setPurchaseResponse] = React.useState<{
    success: boolean;
    text: string;
  }>({ success: false, text: "" });
  const [total, setTotal] = React.useState<string>("0.00");
  const [subtotal, setSubtotal] = React.useState<string>("0.00");
  const [tax, setTax] = React.useState<string>("0.00");
  const [count, setCount] = React.useState<string>("");
  const [refreshBtn, setRefreshBtn] = React.useState<boolean>(true);
  const [buttonProps, setButtonProps] = React.useState<{
    text: string;
    color: string;
    cursor: "not-allowed" | "pointer";
  }>({
    text: "Add Payment",
    color: "grey",
    cursor: "not-allowed",
  });

  React.useEffect(() => {
    if ((customerProfileId.length !== 0 && payment) || guestPayment) {
      if (customerProfileId.length !== 0) {
        console.log("CustomerprofileId: ", customerProfileId);
        console.log("Payment: ", payment);
      } else {
        console.log("Guest Payment: ", guestPayment);
      }
      setButtonProps({
        text: "Order for Pickup",
        color: "green",
        cursor: "pointer",
      });
    } else {
      setButtonProps({
        text: "Add Payment",
        color: "grey",
        cursor: "not-allowed",
      });
    }
  }, [customerProfileId, payment, guestPayment, refreshBtn]);

  React.useEffect(() => {
    const { sum, count } = getCartSumAndCount();
    setSubtotal(roundPrice(sum));
    setCount(String(count));
    // refresh cart... check btn again
    setRefreshBtn((prev) => !prev);
  }, [refreshCart]);
  React.useEffect(() => {
    if (subtotal) {
      const amount = Number(subtotal) * TAX_PERCENT;
      setTax(roundPrice(amount));
    }
  }, [subtotal]);

  React.useEffect(() => {
    setTotal(roundPrice(Number(subtotal) + Number(tax)));
  }, [tax]);

  async function completeCheckout() {
    //reset some values
    setScreen("sending purchase");
    setInvIssues(undefined);
    setPurchaseResponse({ success: false, text: "" });
    // failsafe if no payment and user
    if (!payment || !customerProfileId) return;
    //track if re-stocking is needed
    let stockDecremented: boolean = false;

    // Parse Cart_Items
    const cart_items: PurchasedItem[] = getCartItems();
    cart_items.forEach((item) => {
      let newName = item.name.replaceAll("&", "and");
      if (newName.length > 30) {
        item.name = newName.slice(0, 27) + "...";
      } else {
        item.name = newName;
      }
    });
    // Build Payload object to send for Transaction
    let dataPayload: ChargeProfileDataToSend = {
      customerProfileId,
      customerPaymentProfileId: payment?.paymentProfileId ?? "",
      order: {
        invoiceNumber: "INV-testInvoiceNum", // INV-??
        description: "online order", // online order
      },
      ordered_items: cart_items,
      amountToCharge: Number(total),
    };
    console.log("Checkout Payload: ", dataPayload);

    try {
      //ATTEMPT CHECK INV AND HOLD IT
      const holdRes = await affectInventory("hold-inv", cart_items);
      console.log("CheckRes: ", holdRes);
      //SUCCESSFULLY DECR AVAILABLE STOCK...
      stockDecremented = true;

      //CHARGE PROFILE
      const { data } = await axios({
        url: "http://localhost:1400/chargeProfile",
        method: "POST",
        data: dataPayload,
      });
      console.log("Transaction Response: ", data);
      // setPurchaseResponse({ success: true, text: "Transaction Complete!" });
      //SUCCESSFUL TRANSACTION

      //NOW CLEAR OUT CART ITEMS
      clearCartItems();
      interface AxiosReqSaveOrder {
        url: "/api/orders";
        method: "POST";
        data: SaveOrderReq;
      }
      const refTransId = data.transactionResponse.transId;
      const saveOrderReqConfig: AxiosReqSaveOrder = {
        url: "/api/orders",
        method: "POST",
        data: {
          method: "save-order",
          order: {
            refTransId,
            amountCharged: total,
            subtotal,
            cardNum: payment.cardNumber,
            expDate: payment.expDate,
            userId: session?.user.id!,
          },
          purchasedItems: cart_items,
        },
      };

      //AND SAVE ORDER AND PURCHASED_ITEMS
      const orderRes = await axios(saveOrderReqConfig);
      console.log("Save Order response: ", orderRes.data);
      //REDIRECT TO THANK YOU PAGE (or component)
      globals.refreshCart();
      setScreen(["successful transaction", refTransId]);
      setPurchaseResponse({
        success: true,
        text: "Purchase went through!",
      });
    } catch (e: any) {
      setScreen(undefined);
      // INSUFFICIENT STOCK or Network error
      console.error("Error: ", e);
      if (e?.message === "insufficient inventory") {
        setInvIssues(e.stock);
        setButtonProps({
          color: "grey",
          text: "Insufficient Inventory.",
          cursor: "not-allowed",
        });
      } else {
        //handle network error or transaction error
        // "there was an issue processing your request. Try again later."
        if (stockDecremented) {
          //ATTEMPT to restock [NOT when it's insufficient, DUH]
          try {
            const restockRes = await affectInventory("restock-inv", cart_items);
            console.log("RestockRes: ", restockRes);
          } catch (e) {
            console.log("Couldnt Restock: ", e);
            setPurchaseResponse({
              success: false,
              text: "Merchant Error: couldn't restock.",
            });
          }
        }
        setPurchaseResponse({
          success: false,
          text: "Oops. Payment couldn't be processed.",
        });
      }
    }
  } //complete checkout

  if (subtotal === "0.00") return <></>;

  return (
    <div className={classes.main}>
      <h2 className={classes.title}>Order Summary</h2>
      <div className={classes.row}>
        <span>Subtotal</span>
        <span>${subtotal}</span>
      </div>
      <div className={classes.row}>
        <span>Tax (at {String(TAX_PERCENT).split(".")[1]}%)</span>
        <span>${tax}</span>
      </div>
      <div className={classes.row}>
        <span>Cart Items</span>
        <span>{count}</span>
      </div>
      <div className={classes.row}>
        <span>Payment</span>
        {payment ? (
          <span style={{ textAlign: "right" }}>
            {payment?.cardType}
            <br />
            ••{payment?.cardNumber.slice(-4)}
          </span>
        ) : (
          <>--</>
        )}
      </div>

      <h2 className={classes.row2}>
        <span>Total</span>
        <span>${total}</span>
      </h2>
      <div className={classes.buttonBox}>
        <button
          disabled={
            Number(count) === 0 || customerProfileId.length == 0 || !payment
          }
          onClick={completeCheckout}
          style={{
            backgroundColor: buttonProps.color,
            cursor: buttonProps.cursor,
          }}
        >
          <LockIcon />
          {buttonProps.text}
        </button>
      </div>
      <div
        style={{
          color: "rgba(50,50,50,.7)",
          width: "100%",
          fontSize: "13px",
          textAlign: "center",
        }}
      >
        All purchases are secured with Authorize.net payment gateway.{" "}
        <a
          style={{ color: "inherit", fontSize: "12px" }}
          href="https://www.authorize.net/content/dam/anet2021/documents/security-0604.pdf"
        >
          Learn More
        </a>
      </div>
      <p style={{ color: purchaseResponse.success ? "green" : "red" }}>
        {purchaseResponse.text}
      </p>
    </div>
  );
}

async function affectInventory(
  type: "hold-inv" | "restock-inv",
  cartItems: CartItem[]
): Promise<boolean> {
  let skuAndQuantitis: { sku: string; quantity: number }[] = [];

  cartItems.forEach((item) => {
    skuAndQuantitis.push({ sku: item.sku, quantity: Number(item.quantity) });
  });

  return new Promise((resolve, reject) => {
    axios({
      url: "/api/inventory",
      method: "POST",
      data: {
        method: type,
        items: skuAndQuantitis,
      },
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => reject(e.response.data));
  });
}
