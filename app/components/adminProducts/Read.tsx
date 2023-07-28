"use client";
import React from "react";
import type { ProductStock } from "@/scripts/Types";
import axios from "axios";

export default function Read() {
  const [update, setUpdate] = React.useState<boolean>(false);
  const [productsShown, setProductsShown] = React.useState<ProductStock[]>([]);

  // get ALL products
  React.useEffect(() => {
    (async function () {
      let productResponse = await axios({
        url: "/api/products",
        method: "POST",
        data: { method: "read", category: "all" },
      });

      let products: ProductStock[] = productResponse.data.data;

      console.log("Products READ: \n", products);

      setProductsShown(products);
    })();
  }, [update]);

  return (
    <div>
      <h1>Read Products Table</h1>
      <button onClick={() => setUpdate((prev) => !prev)}>Refresh</button>
      {productsShown.map((item) => (
        <ProductRow product={item} key={item.itemId} />
      ))}
    </div>
  );
}

function ProductRow({ product }: { product: ProductStock }) {
  return (
    <div
      style={{
        border: "1px solid green",
        padding: "20px",
        margin: "3px",
      }}
    >
      <p>SKU#: {product.itemId}</p>
      <p>
        Product: <strong>{product.name}</strong>
      </p>
      <p>${product.unitPrice}</p>
      <p style={{ color: "red" }}>Sale: ${product.salesPrice}</p>
      <p>Flavor: {product.flavor}</p>
      <p>${product.unitPrice}</p>
      <img src={product.imageUrl} width="60" height="60" alt="image" />
    </div>
  );
}
