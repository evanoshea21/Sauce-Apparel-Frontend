"use client";
import React from "react";
import classes from "@/styles/Checkout.module.css";
import { getCartItems, getCartSum } from "@/app/utils";
import type { CartItem } from "@/scripts/Types";
/*
Sole purpose: GET/EDIT cart items from localStorage

CLEAN

Left to do:
- ui (styling table)
- add quantity controls (that MUST edit localStorage)

*/

interface Props {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export default function Cart({ cartItems, setCartItems }: Props) {
  const [totalPrice, setTotalPrice] = React.useState<number>();

  React.useEffect(() => {
    // get localStorage, set cart items
    const cart_items = getCartItems();
    setCartItems(cart_items);
  }, []);

  //set SUM price of cart items
  React.useEffect(() => {
    setTotalPrice(getCartSum());
  }, [cartItems]);

  function removeFromCart(itemId: string) {
    // filter out the itemId
    const newCartItems = cartItems.filter(
      (item: CartItem) => item.itemId !== itemId
    );
    setCartItems(newCartItems);
    // set new
    localStorage.setItem("cart_items", JSON.stringify(newCartItems));
  }

  return (
    <div className={classes.cart}>
      <h1>Cart Items</h1>

      {cartItems.length === 0 && <div>Looks like your cart is empty...</div>}

      {cartItems.length !== 0 &&
        cartItems.map((item, i) => {
          //
          return (
            <div key={i}>
              <h3>{item.name}</h3>
              <span>${item.unitPrice}</span>
              <button onClick={() => removeFromCart(item.itemId)}>
                REMOVE
              </button>
            </div>
          );
        })}
      {totalPrice !== 0 && <h4>Total Price: ${totalPrice}</h4>}
    </div>
  );
}
