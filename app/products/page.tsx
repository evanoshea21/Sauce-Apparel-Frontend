// import React from 'react'
import classes from "@/styles/Products.module.css";
import type { CartItem } from "../../scripts/Types";
import ProductItem from "../components/ProductItem";

const productsFromDb: ProductsList = {
  inventory: [
    {
      itemId: "100",
      img: "",
      name: "Monster Vape Pen",
      description: "MonsterVapes Vape Pen, 150ml, purple flavor",
      quantity: "1",
      unitPrice: "28.99",
    },
    {
      itemId: "101",
      img: "",
      name: "Cookies Pen",
      description: "CookiesVapes Vape Pen, 180ml, apple flavor",
      quantity: "1",
      unitPrice: "39.99",
    },
    {
      itemId: "102",
      img: "",
      name: "Flum Vape",
      description: "Flum Vape, 200ml, orange flavor",
      quantity: "1",
      unitPrice: "25.99",
    },
    {
      itemId: "103",
      img: "",
      name: "Juul Vape",
      description: "MonsterVapes Vape Pen, 200ml, orange flavor",
      quantity: "1",
      unitPrice: "20.49",
    },
  ],
};

interface ProductsList {
  inventory: CartItem[];
}

export default async function ProductsPage() {
  const products: ProductsList = await new Promise((resolve) => {
    // .. fetch from db, but instead just use hard-coded data from above..
    resolve(productsFromDb);
  });

  return (
    <div className={classes.main}>
      <h1>Products Page</h1>

      {products.inventory.map((product) => {
        return <ProductItem productData={product} />;
      })}
    </div>
  );
}
