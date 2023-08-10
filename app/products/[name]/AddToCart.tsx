"use client";
import React from "react";
import type { Product, FlavorsInventoryObj, CartItem } from "@/scripts/Types";
import { getCartItems, addToCart } from "@/app/utils";
//MUI
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

/*
Purpose:
- gather product data (props)
- hold state for FLAVOR and QUANITY
- transmute data to cartItem + max-quanity
- add to cart (utils.ts)
*/

interface Props {
  product: Product;
}
export default function AddToCart({ product }: Props) {
  const [chosenFlavor, setChosenFlavor] = React.useState<{
    sku: string;
    flavor: string;
  }>({ sku: "", flavor: "" });
  const [inventory, setInventory] = React.useState<number>();
  const [determinedPrice, setDeterminedPrice] = React.useState<string>("");
  const [chosenQuantity, setChosenQuantity] = React.useState<number>();
  const [disabled, setDisabled] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (chosenFlavor.sku.length && chosenQuantity) {
      setDisabled(false);
    }
  }, [chosenFlavor, chosenQuantity]);

  React.useEffect(() => {
    if (product) {
      setDeterminedPrice(
        product.product.salesPrice && product.product.salesPrice.length
          ? product.product.salesPrice
          : product.product.unitPrice
      );
    }
  }, [product]);

  function addItemToCart() {
    //transmute data
    const cartItem: CartItem = {
      sku: chosenFlavor.sku,
      name: product.product.name,
      quantity: String(chosenQuantity),
      unitPrice: determinedPrice,
      description: `Flavor: ${chosenFlavor.flavor}`,
      img: product.product.imageUrl,
      maxQuantity: String(inventory),
    };

    //add to cart
    console.log("OG ITEMS: ", getCartItems());
    addToCart(cartItem);
    console.log("NEW ITEMS: ", getCartItems());
  }

  return (
    <div>
      {product.flavors_inventory.map((flavorInv: FlavorsInventoryObj) => {
        return (
          <div
            onClick={() => {
              setChosenFlavor({
                sku: flavorInv.sku ?? "",
                flavor: flavorInv.flavor,
              });
              setInventory(flavorInv.inventory);
            }}
            style={{
              border: "1px solid green",
              backgroundColor:
                chosenFlavor.flavor === flavorInv.flavor ? "grey" : "",
            }}
          >
            <p>Flavor: {flavorInv.flavor}</p>
            <p>Inventory: {flavorInv.inventory}</p>
          </div>
        );
      })}

      {chosenFlavor.flavor.length !== 0 && (
        <Box sx={{ minWidth: 120, maxWidth: 200, m: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="quantity-select-label">Quanity</InputLabel>
            <Select
              labelId="quantity-select-label"
              id="quantity-select"
              value={chosenQuantity ?? "1"}
              label="Quantity"
              onChange={(e) => {
                setChosenQuantity(Number(e.target.value ?? 0));
              }}
            >
              {Array.apply(null, Array(inventory)).map((_x, i: number) => (
                <MenuItem value={i + 1}>{i + 1}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
      <Button variant="contained" disabled={disabled} onClick={addItemToCart}>
        Add to Cart
      </Button>
    </div>
  );
}
