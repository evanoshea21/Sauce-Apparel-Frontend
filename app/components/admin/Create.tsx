"use client";
import React from "react";
import axios from "axios";
import classes from "@/styles/Admin.module.css";
import type { Categories, Product } from "@/scripts/Types";
import Button from "@mui/material/Button";
import { isValidPrice, isPositiveInteger } from "@/app/utils";

import type { FlavorsInventoryObj } from "@/scripts/Types";
import {
  ProductForm,
  FlavorsInventoryForm,
} from "../forms/ProductFlavorsForms";
interface CreateProps {
  formValues?: Product;
  setRefreshList: React.Dispatch<React.SetStateAction<boolean>>;
  setDisplay: React.Dispatch<React.SetStateAction<"add" | "read">>;
}

export default function Create({
  formValues,
  setRefreshList,
  setDisplay,
}: CreateProps) {
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>();
  const [successMessage, setSuccessMessage] = React.useState<
    string | undefined
  >();
  const [isLoadingAjax, setIsLoadingAjax] = React.useState(false);
  // Form inputs
  const [name, setName] = React.useState<string>("");
  const [unitPrice, setUnitPrice] = React.useState<string>("");
  const [imageUrl, setImageUrl] = React.useState<string>("");
  const [inventory, setInventory] = React.useState<number | null>(null);
  const [description, setDescription] = React.useState<string | null>(null);
  const [salesPrice, setSalesPrice] = React.useState<string | null>(null);
  const [category, setCategory] = React.useState<string | null>("Other");
  const [isFeatured, setIsFeatured] = React.useState<boolean>(false);
  const [flavorsInvSalesPriceArr, setFlavorsInvSalesPriceArr] = React.useState<
    FlavorsInventoryObj[]
  >([]);

  function timeoutSuccess() {
    setTimeout(() => {
      setSuccessMessage(undefined);
    }, 3000);
  }

  function handleForms() {
    if (isLoadingAjax) return;
    setIsLoadingAjax(true);
    // Form Error Checks
    if (!name.length || !unitPrice.length || !imageUrl.length) {
      //handle error message UI for required fields
      setErrorMessage(
        "'Name', 'Unit Price', and 'Image URL' are required fields"
      );
      setIsLoadingAjax(false);
      return;
    }
    if (!isValidPrice(unitPrice)) {
      setErrorMessage("Not a valid Unit Price. Max 2 decimal places.");
      setIsLoadingAjax(false);
      return;
    }
    if (salesPrice && !isValidPrice(salesPrice)) {
      setErrorMessage("Not a valid Sales Price. Max 2 decimal places.");
      setIsLoadingAjax(false);
      return;
    }
    if (inventory && !isPositiveInteger(inventory)) {
      setErrorMessage("Inventory must be a positive integer");
      setIsLoadingAjax(false);
      return;
    }

    // check for valid Flavor-Inventory Entries
    console.log("flavors: \n", flavorsInvSalesPriceArr);
    const validFlavorArr: FlavorsInventoryObj[] = [];
    const duplicateFlavors: { [key: string]: boolean } = {};
    for (let i = 0; i < flavorsInvSalesPriceArr.length; i++) {
      let item = flavorsInvSalesPriceArr[i];
      if (!item) continue;
      //if only 1..
      if (
        (item.flavor && !item.inventory) ||
        (!item.flavor && item.inventory)
      ) {
        setErrorMessage("Every flavor must have a corresponding inventory.");
        setIsLoadingAjax(false);
        return;
      }
      // if none, skip
      if (!item.flavor && !item.inventory) continue;
      // if 2, but invalid inventory
      if (!isPositiveInteger(item.inventory)) {
        setErrorMessage("Invalid inventory found. Must be positive integer.");
        setIsLoadingAjax(false);
        return;
      }
      //if duplicate flavor
      if (duplicateFlavors[item.flavor] !== undefined) {
        setErrorMessage("Duplicate Flavors found.");
        setIsLoadingAjax(false);
        return;
      } else {
        duplicateFlavors[item.flavor] = true;
      }
      // else push
      validFlavorArr.push(item);
    }

    const dataPayload: Product = {
      name,
      unitPrice,
      imageUrl,
      description,
      inventory,
      salesPrice,
      category: category ?? "Uncategorized",
      isFeatured,
      Flavors_Inventory: validFlavorArr,
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
        setErrorMessage(undefined);
        setFlavorsInvSalesPriceArr([]);
        setSuccessMessage("Successfully Added!");
        timeoutSuccess();
        setIsLoadingAjax(false);
        setDisplay("read");
      })
      .catch((err) => {
        // account for DUPLICATE ROW
        setIsLoadingAjax(false);
        if (err.response.data.error.meta.target === "Products_name_key") {
          setErrorMessage(
            "A product by this name already exists. Try another name."
          );
        } else {
          console.error(err);
          setErrorMessage("There was an Error updating your product..");
        }
      });
  }

  return (
    <div className={classes.createBox}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "700px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <h1>Add New Product</h1>
        <div
          onClick={() => setDisplay("read")}
          style={{
            fontSize: "1.1rem",
            padding: "10px 20px",
            backgroundColor: "green",
            color: "white",
            cursor: "pointer",
          }}
        >
          Back to List
        </div>
      </div>
      <div className={classes.createForms}>
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
          {errorMessage && (
            <p style={{ marginLeft: "20px", color: "red", maxWidth: "400px" }}>
              Error: {errorMessage}
            </p>
          )}
          {successMessage && (
            <p
              style={{ marginLeft: "20px", color: "green", maxWidth: "400px" }}
            >
              {successMessage}
            </p>
          )}
          <Button
            variant="contained"
            onClick={handleForms}
            style={{ marginLeft: "20px" }}
            disabled={isLoadingAjax}
          >
            {isLoadingAjax ? "Sending.." : "Submit Product"}
          </Button>
        </div>
        <FlavorsInventoryForm
          setFlavorsInvSalesPriceArr={setFlavorsInvSalesPriceArr}
        />
      </div>
    </div>
  );
}
