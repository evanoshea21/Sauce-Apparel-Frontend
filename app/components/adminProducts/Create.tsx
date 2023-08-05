"use client";
import React from "react";
import axios from "axios";
import type { Product } from "@/scripts/Types";
import Button from "@mui/material/Button";

import type { FlavorsInventoryObj } from "@/scripts/Types";
import {
  ProductForm,
  FlavorsInventoryForm,
} from "../forms/ProductFlavorsForms";
interface CreateProps {
  formValues?: Product;
  setRefreshList: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Create({ formValues, setRefreshList }: CreateProps) {
  // Form inputs
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

  function handleForms() {
    /* To account for errors:

    - must have the 3 required fields (name, price, image)
    - stop if flavor exists but NOT inventory, and vice-versa ("Form error: make sure for every flavor, there's a corresponding inventory count, and vice-versa")
    - filter out array where inventory && flavorName are empty strings; and skip over null values (in fact, just valid options into NEW array)
    */
    // Check for necessary inputs first
    if (!name.length || !unitPrice.length || !imageUrl.length) {
      //handle error message UI for required fields
      return;
    }

    const dataPayload: Product = {
      product: {
        name,
        unitPrice,
        imageUrl,
        description,
        inventory,
        salesPrice,
        category,
        isFeatured,
      },
      flavors_inventory: flavorsInvSalesPriceArr,
    };

    // console.log("Data payload: \n", dataPayload);
    // return;

    // [TODO] DONT ALLOW CREATION OF PRODUCT WITH SAME NAME. Do read first, make sure results are empty

    axios({
      url: "/api/products",
      method: "POST",
      data: {
        method: "create",
        data: dataPayload,
      },
    })
      .then((res) => {
        console.log("Create Res: ", res.data);
        setRefreshList((prev) => !prev);
      })
      .catch((e) => console.error("Error Create: ", e));
  }

  return (
    <div>
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
      <Button
        variant="contained"
        onClick={handleForms}
        style={{ marginLeft: "20px" }}
      >
        Submit Product
      </Button>
    </div>
  );
}
