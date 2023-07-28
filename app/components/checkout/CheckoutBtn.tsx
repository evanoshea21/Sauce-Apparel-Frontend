"use client";
import React from "react";
import axios from "axios";
import classes from "@/styles/Checkout.module.css";
import type { CartItem } from "@/scripts/Types";
import { getCartItems, getCartSum } from "../../utils";

/*
Sole purpose:
- Gather customerId, paymentId, and cartItems, AND SEND PAYLOAD to api '/chargeprofile'
- show response to customer, redirect to thank you page

CLEAN

Left to do:
- ui (styling purchase button)
- redirect to ThankYou page
- send email to customer (authorize might handle this)
*/

interface Props {
  customerProfileId: string;
  paymentProfileId: string;
  cartItems: CartItem[];
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
  cartItems,
}: Props) {
  const [purchaseResponse, setPurchaseResponse] = React.useState<{
    success: boolean;
    text: string;
  }>({ success: false, text: "" });

  function completeCheckout() {
    // Parse Cart_Items
    const cart_items = getCartItems();

    // Build Payload object to send for Transaction
    let dataPayload: ChargeProfileDataToSend = {
      customerProfileId,
      customerPaymentProfileId: paymentProfileId,
      order: {
        invoiceNumber: "INV-testInvoiceNum", // INV-??
        description: "online-order", // online order
      },
      ordered_items: cart_items,
      amountToCharge: getCartSum(),
    };
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
    <div>
      <button
        disabled={
          cartItems.length === 0 ||
          customerProfileId.length == 0 ||
          paymentProfileId.length === 0
        }
        onClick={completeCheckout}
      >
        Checkout Button
      </button>
      <p style={{ color: purchaseResponse.success ? "green" : "red" }}>
        {purchaseResponse.text}
      </p>
    </div>
  );
}
