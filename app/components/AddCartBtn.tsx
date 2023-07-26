"use client";

/* this is a CLIENT component that's added to ProductItem SERVER component to allow interactive control on browser.

Function of this component:
- Add productData to cart (localStorage at key called "cart_items")
- check if key for "cart_items" exists.
  - If it doesn't, init array with productData, then JSON.stringify, then set localStorage
  - If it does exist, JSON.parse it, push into array, then JSON.stringify to set new "cart_items"
*/
import React from "react";
import type { Product } from "../../scripts/Types";

interface Props {
  productData: Product;
}

export default function AddCartBtn({ productData }: Props) {
  function addToCart() {
    // serialize, json stringify for localStorage using 'productData' prop
    const cartItemsJSON = localStorage.getItem("cart_items");

    if (!cartItemsJSON) {
      const items = [{ ...productData }];
      localStorage.setItem("cart_items", JSON.stringify(items));
    } else {
      const cartItems = JSON.parse(cartItemsJSON);
      cartItems.push({ ...productData });
      localStorage.setItem("cart_items", JSON.stringify(cartItems));
    }

    const cartItemsJSON2 = localStorage.getItem("cart_items") || "";

    console.log(`New Cart Array:`);
    console.log(JSON.parse(cartItemsJSON2));
  }

  return <button onClick={addToCart}>Add to Cart</button>;
}
