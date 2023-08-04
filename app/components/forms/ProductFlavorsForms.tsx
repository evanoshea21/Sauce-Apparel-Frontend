"use client";
import React from "react";
import type { FlavorsInventoryObj } from "@/scripts/Types";
import classes from "@/styles/Admin.module.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

interface ProductFormProps {
  defaultValues?: {
    name: string;
    unitPrice: string;
    imageUrl: string;

    description: string | null;
    inventory: number | null; //if no flavors
    salesPrice: string | null; // if no flavors
    category: string | null;
    isFeatured?: boolean;
  };
  setName: React.Dispatch<React.SetStateAction<string>>;
  setUnitPrice: React.Dispatch<React.SetStateAction<string>>;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;

  setDescription: React.Dispatch<React.SetStateAction<string | null>>;
  setInventory: React.Dispatch<React.SetStateAction<number | null>>;
  setSalesPrice: React.Dispatch<React.SetStateAction<string | null>>;
  setCategory: React.Dispatch<React.SetStateAction<string | null>>;
  setIsFeatured: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ProductForm(props: ProductFormProps) {
  const [toggleValue, setToggleValue] = React.useState(
    props.defaultValues?.isFeatured !== undefined
      ? props.defaultValues.isFeatured
        ? "true"
        : "false"
      : "false"
  );

  return (
    <div className={classes.main}>
      <h1>Add Product</h1>
      <form>
        <div className={classes.required}>
          {/* required fields go here */}
          <label htmlFor="adminProductCreate_name">Product Name</label>
          <input
            required
            id="adminProductCreate_name"
            placeholder="Flum.."
            name="name"
            type="text"
            defaultValue={props.defaultValues?.name ?? ""}
            onChange={(e) => props.setName(e.target.value)}
          />
          <div className={classes.unitPriceBox}>
            <label htmlFor="adminProductCreate_unitPrice">UnitPrice</label>
            <input
              className={classes.priceInput}
              required
              id="adminProductCreate_unitPrice"
              placeholder="Unit Price"
              name="unitPrice"
              type="number"
              min="1"
              defaultValue={props.defaultValues?.unitPrice ?? ""}
              onChange={(e) => props.setUnitPrice(e.target.value)}
            />
            <span>$</span>
          </div>

          <label htmlFor="adminProductCreate_imageUrl">Image URL</label>
          <input
            required
            id="adminProductCreate_imageUrl"
            placeholder="http://...."
            name="imageUrl"
            type="text"
            defaultValue={props.defaultValues?.imageUrl ?? ""}
            onChange={(e) => props.setImageUrl(e.target.value)}
          />
          <label htmlFor="adminProductCreate_isFeatured">Featured</label>
          <div className={classes.toggle}>
            <ToggleButtonGroup
              value={toggleValue}
              exclusive
              onChange={(e: any) => {
                setToggleValue(e.target.value);
                props.setIsFeatured(e.target.value);
                console.log("Toggle: ", e.target.value);
              }}
            >
              <ToggleButton value="false">No</ToggleButton>
              <ToggleButton value="true">Yes</ToggleButton>
            </ToggleButtonGroup>
          </div>
          {/* <input
            id="adminProductCreate_isFeatured"
            placeholder="isFeatured"
            name="isFeatured"
            type="number"
            defaultValue={props.defaultValues?.isFeatured ? "1" : ""}
            onChange={(e) => props.setIsFeatured(!!Number(e.target.value))}
          /> */}
        </div>
        <div className={classes.optional}>
          {/* optional fields go here */}
          <label htmlFor="adminProductCreate_inventory">Inventory</label>
          <input
            className={classes.invInput}
            id="adminProductCreate_inventory"
            placeholder="Inventory"
            name="inventory"
            type="number"
            min="1"
            step="1"
            defaultValue={props.defaultValues?.inventory ?? ""}
            onChange={(e) => props.setInventory(Number(e.target.value))}
          />

          <div className={classes.unitPriceBox}>
            <label htmlFor="adminProductCreate_salesPrice">Sales Price</label>
            <input
              id="adminProductCreate_salesPrice"
              placeholder="Sales Price"
              name="salesPrice"
              type="text"
              defaultValue={props.defaultValues?.salesPrice ?? ""}
              onChange={(e) => props.setSalesPrice(e.target.value)}
            />
            <span>$</span>
          </div>
          <label htmlFor="adminProductCreate_description">Description</label>
          <input
            id="adminProductCreate_description"
            placeholder="Fast-charging and ..."
            name="description"
            type="text"
            defaultValue={props.defaultValues?.description ?? ""}
            onChange={(e) => props.setDescription(e.target.value)}
          />
          {/* Category dropdown here */}
          <InputLabel id="adminProductCreate_category">Category</InputLabel>
          <Select
            labelId="adminProductCreate_category"
            id="adminProductCreate_category"
            defaultValue={props.defaultValues?.category ?? "Non-Disposable"}
            label="CategoryLabel"
            onChange={(e: any) => props.setCategory(e.target.value)}
          >
            <MenuItem value={"Non-Disposable"}>Non-Disposable</MenuItem>
            <MenuItem value={"Disposable"}>Disposable</MenuItem>
            <MenuItem value={"Vape"}>Vape</MenuItem>
            <MenuItem value={"Other Vapes"}>Other Vapes</MenuItem>
          </Select>
        </div>
      </form>
    </div>
  );
}

interface FlavorsInventoryProps {
  productId?: string;
  setFlavorsInvSalesPriceArr: React.Dispatch<
    React.SetStateAction<FlavorsInventoryObj[]>
  >;
}

export function FlavorsInventoryForm(props: FlavorsInventoryProps) {
  const [rowsCount, setRowsCount] = React.useState(4);

  function handleChange(rowIndex: number) {
    // get the i-th input with name flavor/inventory/salesPrice
    let flavorElem: any = document.querySelector(
      `#flavor-${rowIndex}-${props.productId ?? "create"}`
    );
    let inventoryElem: any = document.querySelector(
      `#inventory-${rowIndex}-${props.productId ?? "create"}`
    );
    let salesPriceElem: any = document.querySelector(
      `#salesPrice-${rowIndex}-${props.productId ?? "create"}`
    );

    let obj = {
      flavor: flavorElem.value,
      inventory: Number(inventoryElem.value),
      salesPrice:
        salesPriceElem.value.length === 0 ? null : salesPriceElem.value,
      productId: "",
    };

    props.setFlavorsInvSalesPriceArr((prev) => {
      let arr = [...prev];
      arr[rowIndex] = obj;
      return arr;
    });
  }
  return (
    <div
      style={{
        border: "3px solid green",
      }}
    >
      <form>
        <h3>Input Flavors & Inventories</h3>
        {Array.apply(null, Array(rowsCount)).map((_x, i: number) => {
          return (
            <div key={i}>
              <input
                className="flavorInventoryInput"
                id={`flavor-${i}-${props.productId ?? "create"}`}
                type="text"
                name="flavor"
                placeholder={`flavor-${i}`}
                onChange={() => handleChange(i)}
              />
              <input
                className="flavorInventoryInput"
                id={`inventory-${i}-${props.productId ?? "create"}`}
                type="text"
                name="inventory"
                placeholder={`inventory-${i}`}
                onChange={() => handleChange(i)}
              />
              <input
                className="flavorInventoryInput"
                id={`salesPrice-${i}-${props.productId ?? "create"}`}
                type="text"
                name="salesPrice"
                placeholder={`salesPrice-${i}`}
                onChange={() => handleChange(i)}
              />
            </div>
          );
        })}
      </form>
      <button
        disabled={rowsCount >= 12}
        onClick={() => setRowsCount((prev) => prev + 4)}
      >
        Add more Flavors
      </button>
    </div>
  );
}

/*

in order to SET the array, onChange should call a function, that get's the current rows data, then inputs it into the INDEX of the setArray prop.


For flavors-inventories-salesprice
SHAPE:

[
  {
    flavor: 'apple'
    inventory: 24
    salesPrice: null
  },
  {
    flavor: 'peach'
    inventory: 94
    salesPrice: '14.89'
  },
  {
    flavor: 'orange'
    inventory: 47
    salesPrice: null
  },

]


*/
