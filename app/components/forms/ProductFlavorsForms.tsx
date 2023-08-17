"use client";
import React from "react";
import type { FlavorsInventoryObj, ProductData } from "@/scripts/Types";
import classes from "@/styles/Admin.module.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import HelpOutlineTwoToneIcon from "@mui/icons-material/HelpOutlineTwoTone";
import { categoryArr as categoryNames } from "@/scripts/Types";

interface ProductFormProps {
  defaultValues?: ProductData;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setUnitPrice: React.Dispatch<React.SetStateAction<string>>;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;

  setDescription: React.Dispatch<React.SetStateAction<string | null>>;
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
  const [isCreateForm, setIsCreateForm] = React.useState<boolean>();

  React.useEffect(() => {
    if (props.defaultValues) {
      setIsCreateForm(false);
    } else {
      setIsCreateForm(true);
    }
  }, [props.defaultValues]);

  return (
    <div className={classes.main}>
      <form className={classes.productForm}>
        <div className={classes.required}>
          {/* required fields go here */}
          <h3>Required Fields</h3>
          <label
            htmlFor={`adminProductCreate_name-${
              isCreateForm ? "create" : "update"
            }`}
          >
            Product Name
          </label>
          <input
            required
            id={`adminProductCreate_name-${isCreateForm ? "create" : "update"}`}
            placeholder="Flum.."
            name="name"
            type="text"
            defaultValue={props.defaultValues?.name ?? ""}
            onChange={(e) => props.setName(e.target.value)}
          />
          <div className={classes.unitPriceBox}>
            <label
              htmlFor={`adminProductCreate_unitPrice-${
                isCreateForm ? "create" : "update"
              }`}
            >
              UnitPrice
            </label>
            <input
              className={classes.priceInput}
              required
              id={`adminProductCreate_unitPrice-${
                isCreateForm ? "create" : "update"
              }`}
              placeholder="Unit Price"
              name="unitPrice"
              type="number"
              min="1"
              defaultValue={props.defaultValues?.unitPrice ?? ""}
              onChange={(e) => props.setUnitPrice(e.target.value)}
            />
            <span>$</span>
          </div>

          <label
            htmlFor={`adminProductCreate_imageUrl-${
              isCreateForm ? "create" : "update"
            }`}
          >
            Image URL
          </label>
          <input
            required
            id={`adminProductCreate_imageUrl-${
              isCreateForm ? "create" : "update"
            }`}
            placeholder="http://...."
            name="imageUrl"
            type="text"
            defaultValue={props.defaultValues?.imageUrl ?? ""}
            onChange={(e) => props.setImageUrl(e.target.value)}
          />
          <label
            className={classes.featuredLabel}
            htmlFor={`adminProductCreate_isFeatured-${
              isCreateForm ? "create" : "update"
            }`}
          >
            Featured
          </label>
          <div className={classes.toggle}>
            <ToggleButtonGroup
              value={toggleValue}
              exclusive
              onChange={(e: any) => {
                setToggleValue(e.target.value);
                props.setIsFeatured(e.target.value === "true" ? true : false);
              }}
            >
              <ToggleButton value="false">No</ToggleButton>
              <ToggleButton value="true">Yes</ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>
        <div className={classes.optional}>
          {/* optional fields go here */}
          <h3>Optional Fields</h3>

          <div className={classes.unitPriceBox}>
            <label
              htmlFor={`adminProductCreate_salesPrice-${
                isCreateForm ? "create" : "update"
              }`}
            >
              Sales Price
            </label>
            <input
              id={`adminProductCreate_salesPrice-${
                isCreateForm ? "create" : "update"
              }`}
              placeholder="Sales Price"
              name="salesPrice"
              type="number"
              defaultValue={props.defaultValues?.salesPrice ?? ""}
              onChange={(e) => props.setSalesPrice(e.target.value)}
            />
            <span>$</span>
          </div>
          <label
            htmlFor={`adminProductCreate_description-${
              isCreateForm ? "create" : "update"
            }`}
          >
            Description
          </label>
          <input
            id={`adminProductCreate_description-${
              isCreateForm ? "create" : "update"
            }`}
            placeholder="Fast-charging and ..."
            name="description"
            type="text"
            defaultValue={props.defaultValues?.description ?? ""}
            onChange={(e) => props.setDescription(e.target.value)}
          />
          {/* Category dropdown here */}
          <InputLabel
            id={`adminProductCreate_category-${
              isCreateForm ? "create" : "update"
            }`}
          >
            Category
          </InputLabel>
          <Select
            labelId={`adminProductCreate_category-${
              isCreateForm ? "create" : "update"
            }`}
            id={`adminProductCreate_category-${
              isCreateForm ? "create" : "update"
            }`}
            defaultValue={props.defaultValues?.category ?? "Other"}
            label="CategoryLabel"
            onChange={(e: any) => props.setCategory(e.target.value)}
          >
            {categoryNames.map((category) => (
              <MenuItem key={category} value={category!}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </div>
      </form>
    </div>
  );
}

interface FlavorsInventoryProps {
  productId?: string;
  setFlavorsInvArr: React.Dispatch<React.SetStateAction<FlavorsInventoryObj[]>>;
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

    let obj = {
      flavor: flavorElem.value,
      inventory: Number(inventoryElem.value),
      productId: props.productId ?? "",
    };

    props.setFlavorsInvArr((prev) => {
      let arr = [...prev];
      arr[rowIndex] = obj;
      return arr;
    });
  }

  return (
    <div className={classes.main}>
      <form className={classes.flavorForm}>
        <h3>Add Flavors & Inventories</h3>
        {Array.apply(null, Array(rowsCount)).map((_x, i: number) => {
          return (
            <div key={i} className={classes.inputRow}>
              <input
                className="flavorInventoryInput"
                id={`flavor-${i}-${props.productId ?? "create"}`}
                type="text"
                name="flavor"
                placeholder={`Flavor #${i + 1}`}
                onChange={() => handleChange(i)}
              />
              <input
                className="flavorInventoryInput"
                id={`inventory-${i}-${props.productId ?? "create"}`}
                type="number"
                min="0"
                name="inventory"
                placeholder={`Inventory #${i + 1}`}
                onChange={() => handleChange(i)}
              />
              {/* <input
                className="flavorInventoryInput"
                id={`salesPrice-${i}-${props.productId ?? "create"}`}
                type="text"
                name="salesPrice"
                placeholder={`Sales Price #${i + 1}`}
                onChange={() => handleChange(i)}
              /> */}
            </div>
          );
        })}
      </form>
      <Button
        variant="outlined"
        disabled={rowsCount >= 40}
        onClick={() => setRowsCount((prev) => prev + 4)}
      >
        Add more Flavors
      </Button>
    </div>
  );
}
