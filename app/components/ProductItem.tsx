import React from "react";
/*

Purpose of this component:
- display a product card for the item
- this is a SERVER component, so there's no interactive ability on client-side. AddCartBtn handles adding product to cart

*/

import type { CartItem } from "../../scripts/Types";
import classes from "@/styles/Products.module.css";
import AddCartBtn from "./AddCartBtn";

interface Props {
  productData: CartItem;
}

export default function ProductItem({ productData }: Props) {
  return (
    <div className={classes.productCard}>
      <div className={classes.imgBox}>
        <img src={productData.img} alt="product image" />
      </div>
      <h2>{productData.name}</h2>
      <p>{productData.description}</p>
      <p>${productData.unitPrice}</p>
      <AddCartBtn productData={productData} />
    </div>
  );
}
