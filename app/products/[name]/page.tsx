// import React from "react";
import axios from "axios";
import type { Product } from "@/scripts/Types";
import AddToCart from "./AddToCart";

interface Props {
  params: any;
}

export default async function ProductDetails({ params }: Props) {
  let response;
  try {
    response = await axios({
      url: "http://localhost:3000/api/products",
      method: "POST",
      data: {
        method: "read",
        fullProduct: true,
        name: params.name.split("-").join(" "),
      },
    });
  } catch (e) {
    console.log("Issue getting productDetails: ", e);
  }

  const product: Product = response?.data[0];

  if (!product) {
    return <>Issue loading product</>;
  }

  return (
    <div>
      <h1>Product Details page for {params.name}</h1>
      <h3>{product.product.name}</h3>
      <p>{product.product.category}</p>
      <p>$ {product.product.unitPrice}</p>

      <AddToCart product={product} />
    </div>
  );
}
