"use client";
import React from "react";
import type { Product } from "@/scripts/Types";
import classes from "@/styles/Checkout.module.css";

export default function Cart() {
  const [cartItems, setCartItems] = React.useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = React.useState<number>();

  React.useEffect(() => {
    // get localStorage, set cart items
    getSetCartItems();
  }, []);

  function getSetCartItems() {
    const cartItemsJSON = localStorage.getItem("cart_items") || "[]";
    const cartItems = JSON.parse(cartItemsJSON);
    setCartItems(cartItems);
  }

  React.useEffect(() => {
    // console.log("cart sum updating...");
    if (cartItems.length !== 0) {
      let sum: number = 0;
      cartItems.forEach((item) => (sum += item.unitPrice));
      setTotalPrice(sum);
    } else {
      setTotalPrice(0);
    }
  }, [cartItems]);

  function removeFromCart(productId: string) {
    // get local storage
    const cartItemsJSON = localStorage.getItem("cart_items") || "[]";
    // parse it
    const cartItems = JSON.parse(cartItemsJSON);

    // filter out the productId
    const newCartItems = cartItems.filter(
      (item: Product) => item.itemId !== productId
    );
    // set new
    localStorage.setItem("cart_items", JSON.stringify(newCartItems));

    getSetCartItems();
  }

  return (
    <div className={classes.cart}>
      <h1>Cart Items</h1>
      {cartItems.length === 0 && <div>Looks like your cart is empty...</div>}
      {cartItems.length !== 0 &&
        cartItems.map((item, i) => {
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
