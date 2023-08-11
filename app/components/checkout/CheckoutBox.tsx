"use client";
import React from "react";
import axios from "axios";
import classes from "@/styles/CheckoutBox.module.css";
import type { CartItem } from "@/scripts/Types";
import { getCartItems, getCartSumAndCount } from "../../utils";

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

interface Props {
  customerProfileId: string;
  paymentProfileId: string;
  refreshCart: boolean;
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
  paymentProfileId,
  refreshCart,
}: Props) {
  const [purchaseResponse, setPurchaseResponse] = React.useState<{
    success: boolean;
    text: string;
  }>({ success: false, text: "" });
  const [total, setTotal] = React.useState<string>("");
  const [subtotal, setSubtotal] = React.useState<number>(0);
  const [tax, setTax] = React.useState<number>(0);
  const [count, setCount] = React.useState<string>("");
  const [buttonTextColor, setButtonTextColor] = React.useState<{
    text: string;
    color: string;
  }>({ text: "Order for Pickup", color: "green" });

  React.useEffect(() => {
    if (customerProfileId.length === 0 || paymentProfileId.length === 0) {
      setButtonTextColor({ text: "Add Payment Card", color: "grey" });
    } else {
      setButtonTextColor({ text: "Order for Pickup", color: "green" });
    }
  }, [customerProfileId, paymentProfileId]);

  React.useEffect(() => {
    const { sum, count } = getCartSumAndCount();
    setSubtotal(sum);
    setCount(String(count));
  }, [refreshCart]);
  React.useEffect(() => {
    if (subtotal) {
      const amount = subtotal * TAX_PERCENT;
      setTax(amount);
    }
  }, [subtotal]);

  React.useEffect(() => {
    setTotal(String(roundPrice(subtotal + tax)));
  }, [tax]);

  function completeCheckout() {
    // Parse Cart_Items
    const cart_items = getCartItems();
    // [TODO] remove unnecesary properties like MaxQuantity AFTER holding-inventory

    // Build Payload object to send for Transaction
    let dataPayload: ChargeProfileDataToSend = {
      customerProfileId,
      customerPaymentProfileId: paymentProfileId,
      order: {
        invoiceNumber: "INV-testInvoiceNum", // INV-??
        description: "online-order", // online order
      },
      ordered_items: cart_items,
      amountToCharge: Number(total),
    };

    console.log("Checkout Payload: ", dataPayload);
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

  //
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

      <h2 className={classes.row2}>
        <span>Total</span>
        <span>${total}</span>
      </h2>
      <div className={classes.buttonBox}>
        <button
          disabled={
            Number(count) === 0 ||
            customerProfileId.length == 0 ||
            paymentProfileId.length === 0
          }
          onClick={completeCheckout}
          style={{
            backgroundColor: buttonTextColor.color,
          }}
        >
          {buttonTextColor.text}
        </button>
      </div>
      <p style={{ color: purchaseResponse.success ? "green" : "red" }}>
        {purchaseResponse.text}
      </p>
    </div>
  );
}

function roundPrice(price: number) {
  let num = price;
  num *= 100;
  let rounded = Math.round(num);
  return rounded / 100;
}
