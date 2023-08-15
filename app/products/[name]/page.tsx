// import React from "react";
import axios from "axios";
import type { Product } from "@/scripts/Types";
import ConfigAddToCart from "./ConfigAddToCart";
import Navbar from "@/app/components/Navbar";
import classes from "@/styles/DetailsPage.module.css";

interface Props {
  params: any;
}

export default async function ProductDetails({ params }: Props) {
  let name = params.name.split("-").join(" ");
  let newName = name.replace("%26", "&");
  let response;
  try {
    response = await axios({
      url: "http://localhost:3000/api/products",
      method: "POST",
      data: {
        method: "read",
        fullProduct: true,
        name: newName,
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
      <Navbar />
      <div className={classes.main}>
        <div className={classes.imgBox}>
          <img src={product.product.imageUrl} alt="product image" />
        </div>
        <div className={classes.details}>
          <h1>{product.product.name}</h1>
          <h2>$ {product.product.unitPrice}</h2>
          <h3>Choose a Flavor</h3>
          <ConfigAddToCart product={product} />
        </div>
      </div>
    </div>
  );
}
