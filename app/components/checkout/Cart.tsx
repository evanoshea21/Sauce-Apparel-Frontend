"use client";
import React from "react";
import classes from "@/styles/Cart.module.css";
import { getCartItems, getCartSum } from "@/app/utils";
import type { CartItem } from "@/scripts/Types";
/*
Sole purpose: GET/EDIT cart items from localStorage

CLEAN

Left to do:
- ui (styling table)
- add quantity controls (that MUST edit localStorage)

*/

const cartItemsData: CartItem[] = [
  {
    sku: "2084bkasdj82bf803",
    name: "Flume Vapes",
    quantity: "1",
    maxQuantity: "4",
    unitPrice: "24.99",
    description: "peach",
    img: "htttp:///cjdsncjdsnjcds",
  },
  {
    sku: "12njb23b082buef0c",
    name: "Big Vape",
    quantity: "2",
    maxQuantity: "5",
    unitPrice: "34.99",
    description: "pear",
    img: "htttp:///cjdsncjdsnjcds",
  },
  {
    sku: "csb23f3of84b3fwuofu",
    name: "Disposable Vape",
    quantity: "1",
    maxQuantity: "3",
    unitPrice: "14.50",
    description: "mint",
    img: "htttp:///cjdsncjdsnjcds",
  },
  {
    sku: "2jnj2lj3nuo32uc40",
    name: "Air Vape",
    quantity: "1",
    maxQuantity: "10",
    unitPrice: "54.99",
    description: "orange",
    img: "htttp:///cjdsncjdsnjcds",
  },
];

interface Props {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export default function Cart(props: any) {
  const [totalPrice, setTotalPrice] = React.useState<number>();
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  // const [cartItems, setCartItems] = React.useState<CartItem[]>([])

  // GET SET cart items from LocalStorage
  React.useEffect(() => {
    // get localStorage, set cart items
    const cart_items = cartItemsData;
    // const cart_items = getCartItems();
    setCartItems(cart_items);
  }, []);

  //set SUM price of cart items
  React.useEffect(() => {
    setTotalPrice(getCartSum());
    console.log("Cart: ", cartItemsData);
  }, [cartItems]);

  function removeFromCart(itemId: string) {
    // filter out the itemId
    const newCartItems = cartItems.filter(
      (item: CartItem) => item.sku !== itemId
    );
    setCartItems(newCartItems);
    // set new
    localStorage.setItem("cart_items", JSON.stringify(newCartItems));
  }

  function changeQuantity() {}

  return (
    <div className={classes.main}>
      <h1>Cart Items</h1>

      {cartItems.length === 0 && <div>Looks like your cart is empty...</div>}

      {cartItems.length !== 0 &&
        cartItems.map((item, i) => {
          //
          return (
            <div key={i}>
              <h3>{item.name}</h3>
              <span>${item.unitPrice}</span>
              <button onClick={() => removeFromCart(item.sku)}>REMOVE</button>
            </div>
          );
        })}
      {totalPrice !== 0 && <h4>Total Price: ${totalPrice}</h4>}
    </div>
  );
}
