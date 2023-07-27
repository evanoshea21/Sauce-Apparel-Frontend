"use client";
import React from "react";
import axios from "axios";
import classes from "@/styles/Checkout.module.css";
import type { Product } from "@/scripts/Types";

interface Props {
  customerProfileId: string;
  paymentProfileId: string;
}
interface Address {
  firstName: string;
  lastName: string;
  Company: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}
interface ChargeProfileDataToSend {
  customerProfileId: string;
  customerPaymentProfileId: string;
  order: {
    invoiceNumber: string; // INV-??
    description?: string; // online order
  };
  ordered_items: Product[];
  // shipTo?: Address;
  amountToCharge: number;
}

export default function CheckoutBtn({
  customerProfileId,
  paymentProfileId,
}: Props) {
  const [isDisabled, setIsDisabled] = React.useState(true);
  const [purchaseResponse, setPurchaseResponse] = React.useState<{
    success: boolean;
    text: string;
  }>({ success: false, text: "" });

  React.useEffect(() => {
    if (customerProfileId.length != 0 && paymentProfileId.length != 0) {
      setIsDisabled(false);
    }
  }, [customerProfileId, paymentProfileId]);

  function completeCheckout() {
    // Parse Cart_Items
    const cart_itemsJSON = localStorage.getItem("cart_items") || "";
    const cart_items = JSON.parse(cart_itemsJSON);

    // Calculate sum to charge customer
    let sum: number = 0;
    cart_items.forEach(
      (item: Product) => (sum += item.unitPrice * Number(item.quantity))
    );

    //Check, Block API transaction call if insufficient data
    if (
      !customerProfileId.length ||
      !paymentProfileId.length ||
      !cart_items.length
    ) {
      return;
    }

    // Build Payload object to send for Transaction
    let dataPayload: ChargeProfileDataToSend = {
      customerProfileId,
      customerPaymentProfileId: paymentProfileId,
      order: {
        invoiceNumber: "INV-testInvoiceNum", // INV-??
        description: "online-order", // online order
      },
      ordered_items: cart_items,
      // shipTo?: Address;
      amountToCharge: sum,
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
      <button disabled={isDisabled} onClick={completeCheckout}>
        Checkout Button
      </button>
      <p style={{ color: purchaseResponse.success ? "green" : "red" }}>
        {purchaseResponse.text}
      </p>
    </div>
  );
}
