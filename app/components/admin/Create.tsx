"use client";
import React from "react";
import axios from "axios";
import classes from "@/styles/Admin.module.css";
import type { Categories, Product } from "@/scripts/Types";
import Button from "@mui/material/Button";
import { isValidPrice, isPositiveInteger } from "@/app/utils";
import type { SizesInventoryObj } from "@/scripts/Types";
import { ProductForm, SizesInventoryForm } from "../forms/ProductSizesForms";
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
  const [description, setDescription] = React.useState<string | null>(null);
  const [salesPrice, setSalesPrice] = React.useState<string | null>(null);
  const [category, setCategory] = React.useState<string | null>("Other");
  const [isFeatured, setIsFeatured] = React.useState<boolean>(false);
  const [sizesInvArr, setSizesInvArr] = React.useState<SizesInventoryObj[]>([]);

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

    // check for valid Size-Inventory Entries
    console.log("sizes: \n", sizesInvArr);
    const validSizeArr: SizesInventoryObj[] = [];
    const duplicateSizes: { [key: string]: boolean } = {};
    for (let i = 0; i < sizesInvArr.length; i++) {
      let item = sizesInvArr[i];
      if (!item) continue;
      //if only 1..
      if ((item.size && !item.inventory) || (!item.size && item.inventory)) {
        setErrorMessage(
          "Every size must have a corresponding inventory (that is > 0)."
        );
        setIsLoadingAjax(false);
        return;
      }
      // if none, skip
      if (!item.size && !item.inventory) continue;
      // if 2, but invalid inventory
      if (!isPositiveInteger(item.inventory)) {
        setErrorMessage("Invalid inventory found. Must be positive integer.");
        setIsLoadingAjax(false);
        return;
      }
      //if duplicate size
      if (duplicateSizes[item.size] !== undefined) {
        setErrorMessage("Duplicate Sizes found.");
        setIsLoadingAjax(false);
        return;
      } else {
        duplicateSizes[item.size] = true;
      }
      // else push
      validSizeArr.push(item);
    }

    const dataPayload: Product = {
      name,
      unitPrice,
      imageUrl,
      description,
      salesPrice,
      category: category ?? "Other",
      isFeatured,
      Sizes_Inventory: validSizeArr,
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
        setSizesInvArr([]);
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
          padding: "10px",
        }}
      >
        <h1>Add New Product</h1>
        <div
          onClick={() => setDisplay("read")}
          style={{
            fontSize: "1.1rem",
            padding: "10px 20px",
            backgroundColor: "rgb(55, 64, 57)",
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
              style={{
                marginLeft: "20px",
                color: "rgb(55, 64, 57)",
                maxWidth: "400px",
              }}
            >
              {successMessage}
            </p>
          )}
          <Button
            variant="contained"
            onClick={handleForms}
            style={{ margin: "20px 0 0 12px" }}
            disabled={isLoadingAjax}
          >
            {isLoadingAjax ? "Sending.." : "Submit Product"}
          </Button>
        </div>
        <SizesInventoryForm setSizesInvArr={setSizesInvArr} />
      </div>
    </div>
  );
}
