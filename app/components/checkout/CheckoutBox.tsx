"use client";
import React from "react";
import axios from "axios";
import classes from "@/styles/CheckoutBox.module.css";
import type {
  CartItem,
  CartItem2,
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
  toSdkExpDate,
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
        color: "rgb(55, 64, 57)",
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

  function initCheckout() {
    //reset some values
    setScreen("sending purchase");
    setInvIssues(undefined);
    setPurchaseResponse({ success: false, text: "" });
    // failsafe if no payment and user
    if (!payment && !guestPayment) return;
    //track if re-stocking is needed
    let stockDecremented: boolean = false;
    // Parse Cart_Items
    const cart_items: PurchasedItem[] = getCartItems();
    // const cart_items: PurchasedItem[] = getCartItems();
    cart_items.forEach((item) => {
      let newName = item.name.replaceAll("&", "and");
      if (newName.length > 30) {
        item.name = newName.slice(0, 27) + "...";
      } else {
        item.name = newName;
      }
    });

    //

    //NOW: DECIDE TO GO GUEST ROUTE OR CUSTOMER PROFILE ROUTE
    if (payment) {
      completeCustomerCheckout(cart_items, stockDecremented);
    } else if (guestPayment) {
      completeGuestCheckout(cart_items, stockDecremented);
    }
  } //init checkout

  async function completeCustomerCheckout(
    cart_items: PurchasedItem[],
    // cart_items: PurchasedItem[],
    stockDecremented: boolean
  ) {
    console.log("Completing Customer Checkout..");

    // [1] Build Payload object to send for Transaction
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

    try {
      //[2] VERIFY ITEMS IN STOCK, DECREMENT IF SO
      const holdRes = await affectInventory("hold-inv", cart_items);
      stockDecremented = true;

      //[3] CHARGE PROFILE
      const { data } = await axios({
        url: `${process.env.NEXT_PUBLIC_SDK_SERVER_BASE_URL}/chargeProfile`,
        method: "POST",
        data: dataPayload,
      });
      console.log("Transaction Response: ", data);
      // successful transaction!

      //[4] CLEAR OUT CART ITEMS
      clearCartItems();

      //[5] SAVE ORDER TO DB
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
            cardNum: payment?.cardNumber!,
            expDate: payment?.expDate!,
            userId: session?.user.id!,
          },
          purchasedItems: cart_items,
        },
      };
      // ..saving order to db now
      const orderRes = await axios(saveOrderReqConfig);
      console.log("Save Order response: ", orderRes.data);
      // [6] DONE - SHOW USER THANK YOU PAGE
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
        console.log("Insufficient Inventory: \n", e.stock);
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
  } // end completeCustomerCheckout

  //

  async function completeGuestCheckout(
    cart_items: PurchasedItem[],
    stockDecremented: boolean
  ) {
    if (!guestPayment) return;
    console.log("Completing Guest Checkout..");
    //re-parse purchasedItem into CartItem2 (unitPrice number to string)

    // [1] Build Guest Payload object to send for Transaction
    let guestPaymentPayload: ChargeCardData = {
      creditCard: {
        cardNumber: guestPayment.creditCard.cardNumber,
        expDate: toSdkExpDate(guestPayment.creditCard.expDate),
        cvv: guestPayment.creditCard.cvv,
      },
      invoiceNum: "INV-test", // change later
      description: "idk bruh", // change later
      amount: total,
      billTo: {
        firstName: guestPayment.billTo.firstName,
        lastName: guestPayment.billTo.lastName,
        address: guestPayment.billTo.address,
        city: guestPayment.billTo.city,
        state: guestPayment.billTo.state,
        zip: guestPayment.billTo.zip,
        country: guestPayment.billTo.country,
      },
      ordered_items: cart_items,
    };

    try {
      //[2] VERIFY ITEMS IN STOCK, DECREMENT IF SO
      const holdRes = await affectInventory("hold-inv", cart_items);
      stockDecremented = true;

      //[3] CHARGE GUEST's CARD
      const { data } = await axios({
        url: `${process.env.NEXT_PUBLIC_SDK_SERVER_BASE_URL}/chargeCard`,
        method: "POST",
        data: guestPaymentPayload,
      });
      console.log("Guest Transaction Response: ", data);
      // successful transaction!

      //[4] CLEAR OUT CART ITEMS
      clearCartItems();

      //[5] CAN'T save order because don't have a user to associate purchase with...
      // [6] DONE - SHOW USER THANK YOU PAGE
      const refTransId = data.transactionResponse.transId;
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
  } // end completeGuestCheckout

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
        {payment && (
          <span style={{ textAlign: "right" }}>
            {payment?.cardType}
            <br />
            ••{payment?.cardNumber.slice(-4)}
          </span>
        )}
        {guestPayment && (
          <span style={{ textAlign: "right" }}>
            {detectCardType(guestPayment.creditCard.cardNumber)}
            <br />
            ••{guestPayment.creditCard.cardNumber.slice(-4)}
          </span>
        )}

        {!guestPayment && !payment && <>--</>}
      </div>

      <h2 className={classes.row2}>
        <span>Total</span>
        <span>${total}</span>
      </h2>
      <div className={classes.buttonBox}>
        <button
          disabled={buttonProps.cursor === "not-allowed"}
          onClick={initCheckout}
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
      <p
        style={{
          color: purchaseResponse.success ? "rgb(55, 64, 57)" : "red",
        }}
      >
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

function detectCardType(number: string): string | undefined {
  const re: any = {
    Electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
    Maestro:
      /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
    Dankort: /^(5019)\d+$/,
    Interpayment: /^(636)\d+$/,
    Unionpay: /^(62|88)\d+$/,
    Visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    Mastercard: /^5[1-5][0-9]{14}$/,
    Amex: /^3[47][0-9]{13}$/,
    Diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
    Discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
    Jcb: /^(?:2131|1800|35\d{3})\d{11}$/,
  };

  for (var key in re) {
    if (re[key].test(number)) {
      return key;
    }
  }
}
