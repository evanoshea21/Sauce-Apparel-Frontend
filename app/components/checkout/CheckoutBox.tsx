"use client";
import React from "react";
import axios from "axios";
import classes from "@/styles/CheckoutBox.module.css";
import type { CartItem } from "@/scripts/Types";
import { getCartItems, getCartSumAndCount, roundPrice } from "../../utils";
import LockIcon from "@mui/icons-material/Lock";
import type { Payment } from "./index";

const TAX_PERCENT = Number(process.env.NEXT_PUBLIC_STATE_TAX_AS_DECIMAL);

/*
Sole purpose:
- Gather customerId, paymentId, and cartItems, AND SEND PAYLOAD to api '/chargeprofile'
- show response to customer, redirect to thank you page

Proper flow of purchase:
- First Check items are in stock, and hold them (decrement items in cart) if they are -- same time on same route
- Then hit Transaction (ChargeCustomer)
  - Success:
    - re-route to thank you
    - use response to add to ORDER table AND cartItems to PurchasedItems
  - Error:
    - re-route to error
    - UNDO items HOLD (increment all items in cart)

*/
export interface InvIssues {
  sku: string;
  availableInv: number;
}

interface Props {
  customerProfileId: string;
  payment: Payment | undefined;
  refreshCart: boolean;
  setInvIssues: React.Dispatch<React.SetStateAction<InvIssues[] | undefined>>;
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
  refreshCart,
  setInvIssues,
}: Props) {
  const [purchaseResponse, setPurchaseResponse] = React.useState<{
    success: boolean;
    text: string;
  }>({ success: false, text: "" });
  const [total, setTotal] = React.useState<string>("");
  const [subtotal, setSubtotal] = React.useState<number>(0);
  const [tax, setTax] = React.useState<number>(0);
  const [count, setCount] = React.useState<string>("");
  const [buttonProps, setButtonProps] = React.useState<{
    text: string;
    color: string;
    cursor: "not-allowed" | "pointer";
  }>({ text: "Order for Pickup", color: "green", cursor: "pointer" });

  React.useEffect(() => {
    if (customerProfileId.length === 0 || !payment) {
      setButtonProps({
        text: "Add Payment",
        color: "grey",
        cursor: "not-allowed",
      });
    } else {
      setButtonProps({
        text: "Order for Pickup",
        color: "green",
        cursor: "pointer",
      });
    }
  }, [customerProfileId, payment]);

  React.useEffect(() => {
    const { sum, count } = getCartSumAndCount();
    setSubtotal(roundPrice(sum));
    setCount(String(count));
  }, [refreshCart]);
  React.useEffect(() => {
    if (subtotal) {
      const amount = subtotal * TAX_PERCENT;
      setTax(roundPrice(amount));
    }
  }, [subtotal]);

  React.useEffect(() => {
    setTotal(String(roundPrice(subtotal + tax)));
  }, [tax]);

  async function completeCheckout() {
    setInvIssues(undefined);
    if (!payment || !customerProfileId) return; // failsafe if no payment and user

    // Parse Cart_Items
    const cart_items = getCartItems();
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
    console.log("Checkout Payload1: ", dataPayload);

    try {
      const holdRes = await checkAndHold(cart_items);
      console.log("CheckRes: ", holdRes);
    } catch (e: any) {
      console.error("CheckHold Error: ", e);
      if (e?.message === "insufficient inventory") {
        setInvIssues(e.stock);
        // change buttonProps
        setButtonProps({
          color: "grey",
          text: "Insufficient Funds, Edit your Cart.",
          cursor: "not-allowed",
        });
      }
    }
    return;

    // Send Transaction call to Customer Profile
    axios({
      url: "http://localhost:1400/chargeProfile",
      method: "POST",
      data: dataPayload,
    })
      .then((res) => {
        console.log("transaction response: ", res.data);
        // response OK, tell user (UI) the transaction has gone through
        setPurchaseResponse({ success: true, text: "Transaction Complete!" });
      })
      .catch((e) => {
        console.error("issue with transaction: \n", e);
        // response NOT OK, tell user (UI) why transaction has failed
        setPurchaseResponse({
          success: false,
          text: "Payment didn't go through :(",
        });
      });
  }

  if (subtotal === 0) return <></>;

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

async function checkAndHold(cartItems: CartItem[]): Promise<boolean> {
  let skuAndQuantitis: { sku: string; quantity: number }[] = [];

  cartItems.forEach((item) => {
    skuAndQuantitis.push({ sku: item.sku, quantity: Number(item.quantity) });
  });

  return new Promise((resolve, reject) => {
    axios({
      url: "/api/inventory",
      method: "POST",
      data: {
        method: "hold-inv",
        items: skuAndQuantitis,
      },
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => reject(e.response.data));
  });
}
