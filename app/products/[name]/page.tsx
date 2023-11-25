// import React from "react";
import axios from "axios";
import type { Product } from "@/scripts/Types";
import ConfigAddToCart from "./ConfigAddToCart";
import classes from "@/styles/DetailsPage.module.css";
import { roundPrice } from "@/app/utils";
import { determineColor } from "@/app/components/ProductCard";
import { axiosCall } from "@/app/utils";

export const revalidate = 60;

interface Props {
  params: any;
}

export default async function ProductDetails({ params }: Props) {
  let name = params.name.split("-").join(" ");
  let newName = name.replace("%26", "&");
  let response;
  try {
    response = await axiosCall({
      url: `${process.env.NEXT_PUBLIC_SDK_SERVER_BASE_URL}/products`,
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

  const product: Product = response[0];

  if (!product) {
    return (
      <h2 style={{ textAlign: "center", margin: "100px" }}>
        Couldn't Find Product
      </h2>
    );
  }

  return (
    <div>
      {/* <Navbar /> */}
      <div className={classes.main}>
        <div className={classes.imgBox}>
          <img src={product.imageUrl} alt="product image" />
        </div>
        <div className={classes.details}>
          <h1 style={{ marginBottom: "15px" }}>{product.name}</h1>
          <div
            style={{
              border: `1px solid ${determineColor(product.category ?? "")}`,
              color: determineColor(product.category ?? ""),
            }}
            className={classes.category}
          >
            {product.category}
          </div>
          {product.salesPrice ? (
            <div style={{ marginTop: "12px" }} className={classes.salesPrice}>
              <h2 style={{ color: "red" }}>
                $ {roundPrice(product.salesPrice)}
              </h2>
              <div className={classes.sales}>
                <h2>${product.unitPrice}</h2>
                <div className={classes.strike}></div>
              </div>
            </div>
          ) : (
            <h2>$ {product.unitPrice}</h2>
          )}
          <h3 className={classes.chooseSizeText}>Choose a Size</h3>
          <ConfigAddToCart product={product} />
        </div>
      </div>
    </div>
  );
}
