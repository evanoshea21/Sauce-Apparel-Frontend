"use client";
import React from "react";
import type { ProductStock } from "@/scripts/Types";
import axios from "axios";

export default function Read() {
  const [update, setUpdate] = React.useState<boolean>(false);
  const [productsShown, setProductsShown] = React.useState<ProductStock[]>();

  // get ALL products
  React.useEffect(() => {
    (async function () {
      let products: ProductStock[] = await axios({
        url: "/api/products",
        method: "GET",
      });

      console.log("Products READ: \n", products);

      // setProductsShown(products);
    })();
  }, [update]);

  return (
    <div>
      <h1>Read Products Table</h1>
      <button onClick={() => setUpdate((prev) => !prev)}>Refresh</button>
      {productsShown?.map((item) => (
        <ProductRow product={item} />
      ))}
    </div>
  );
}

function ProductRow({ product }: { product: ProductStock }) {
  return (
    <div
      style={{
        border: "1px solid green",
        padding: "20px;",
        margin: "3px",
      }}
    >
      This is a row with Product: {product.name}
    </div>
  );
}
