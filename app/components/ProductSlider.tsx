import { ProductData, Product } from "@/scripts/Types";
import classes from "@/styles/ProductDisplay.module.css";
import axios from "axios";
import ProductCard from "./ProductCard";
import { returnShuffledArray } from "../utils";

interface Props {
  products: Product[] | ProductData[];
  title: string;
  shuffle?: boolean;
}

export default async function ProductSlider({
  products,
  title,
  shuffle,
}: Props) {
  if (Array.isArray(products) && products.length === 0) {
    return <></>;
  }

  return (
    <div className={classes.sliderMain}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          margin: "20px 0 10px 0",
        }}
      >
        <h1>{title}</h1>
        <div
          style={{
            width: "140px",
            height: "3px",
            backgroundColor: "rgb(55, 64, 57)",
            borderRadius: "20px",
          }}
        ></div>
      </div>
      <div className={classes.boxForFade}>
        <div className={classes.sliderDisplay}>
          {!shuffle &&
            products.map((product) => {
              return <ProductCard key={product.id} product={product} />;
            })}
          {shuffle &&
            returnShuffledArray(products).map((product) => {
              return <ProductCard key={product.id} product={product} />;
            })}
          <div
            style={{
              display: "block",
              width: "200px",
              height: "300px",
              // backgroundColor: "blue",
            }}
          ></div>
        </div>
        <div className={classes.fade}></div>
      </div>
    </div>
  );
}
