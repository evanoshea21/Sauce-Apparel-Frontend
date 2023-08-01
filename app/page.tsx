"use client";
import React from "react";
import Image from "next/image";
import classes from "@/styles/Home.module.css";
import TransactionButton from "./components/TransactionButton";
import {
  ProductForm,
  FlavorsInventoryForm,
} from "./components/forms/ProductFlavorsForms";

import type { FlavorsInventoryObj } from "@/scripts/Types";

export default function Home() {
  const [name, setName] = React.useState<string>("");
  const [unitPrice, setUnitPrice] = React.useState<string>("");
  const [imageUrl, setImageUrl] = React.useState<string>("");
  const [inventory, setInventory] = React.useState<number | null>(null);
  const [description, setDescription] = React.useState<string | null>(null);
  const [salesPrice, setSalesPrice] = React.useState<string | null>(null);
  const [category, setCategory] = React.useState<string | null>(null);
  const [isFeatured, setIsFeatured] = React.useState<boolean>(false);
  const [flavorsInvSalesPriceArr, setFlavorsInvSalesPriceArr] = React.useState<
    FlavorsInventoryObj[]
  >([]);

  React.useEffect(() => {
    console.log("isF: ", isFeatured);
  }, [isFeatured]);

  // React.useEffect(() => {
  //   console.log("Flavors arr: \n", flavorsInvSalesPriceArr);
  // }, [flavorsInvSalesPriceArr]);

  function printResults() {
    let obj = {
      name,
      unitPrice,
      imageUrl,
      inventory,
      description,
      salesPrice,
      category,
      isFeatured,
      flavors_inventory: flavorsInvSalesPriceArr,
    };
    console.log("Form inputs: \n", obj);
  }

  return (
    <div className={classes.main}>
      <p>Hello world, testing transactions here</p>
      {/* <TransactionButton /> */}
      {/* <img
        style={{
          margin: "0 40px",
        }}
        width="700px"
        alt="graphic"
        src="/customerProfile.jpg"
      /> */}
      <ProductForm
        setName={setName}
        setUnitPrice={setUnitPrice}
        setImageUrl={setImageUrl}
        setInventory={setInventory}
        setDescription={setDescription}
        setSalesPrice={setSalesPrice}
        setCategory={setCategory}
        setIsFeatured={setIsFeatured}
      />
      <FlavorsInventoryForm
        setFlavorsInvSalesPriceArr={setFlavorsInvSalesPriceArr}
      />
      <button onClick={() => printResults()}>Print Results</button>
    </div>
  );
}
