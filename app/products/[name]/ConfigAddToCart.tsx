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
import classes from "@/styles/DetailsPage.module.css";
import classes2 from "@/styles/ProductCard.module.css";
import Dropdown from "@/app/components/ui/Dropdown";
import QSelect from "@/app/components/ui/QSelect";
import { SaveBtn } from "../../components/ClientElements";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [chosenFlavor, setChosenFlavor] = React.useState<string>("");
  const [chosenSku, setChosenSku] = React.useState<string>("");
  const [chosenQuantity, setChosenQuantity] = React.useState<number>(1);
  const [inventory, setInventory] = React.useState<number>();
  const [disabled, setDisabled] = React.useState<boolean>(true);
  const [determinedPrice, setDeterminedPrice] = React.useState<string>("");

  const [flavorsArr, setFlavorsArr] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (chosenFlavor?.length === 0) return;
    setDisabled(false);
    setChosenQuantity(1);
    //set sku, AND inventory (for cart later)
    let flavorRow = product.flavors_inventory.find(
      (product) => chosenFlavor === product.flavor
    );
    setInventory(Number(flavorRow?.inventory));
    setChosenSku(flavorRow?.sku ?? "");
  }, [chosenFlavor]);

  React.useEffect(() => {
    if (product) {
      setDeterminedPrice(
        product.product.salesPrice && product.product.salesPrice.length
          ? product.product.salesPrice
          : product.product.unitPrice
      );
      // set flavors array (for dropdown)
      const arr: string[] = [];
      product.flavors_inventory.forEach((flavorInv) => {
        if (flavorInv.inventory > 0) {
          arr.push(flavorInv.flavor);
        }
      });
      setFlavorsArr(arr);
    }
  }, [product]);

  function addItemToCart() {
    if (chosenFlavor.length === 0) return;
    //transmute data
    const cartItem: CartItem = {
      sku: chosenSku,
      name: product.product.name,
      quantity: String(chosenQuantity),
      unitPrice: determinedPrice,
      description: `Flavor: ${chosenFlavor}`,
      img: product.product.imageUrl,
      maxQuantity: String(inventory),
    };

    //add to cart
    console.log("OG ITEMS: ", getCartItems());
    addToCart(cartItem);
    router.push("/");
    console.log("NEW ITEMS: ", getCartItems());
  }

  return (
    <div>
      <div className={classes.configFlavorAndQuantity}>
        <Dropdown handleChange={setChosenFlavor} values={flavorsArr} />
        <div style={{ zIndex: "0" }}>
          <QSelect
            value={chosenQuantity}
            changeQuantity={setChosenQuantity}
            maxQuantity={inventory ?? 1}
          />
        </div>
      </div>

      <p
        style={{
          color: "red",
          height: "20px",
          padding: "0",
          margin: "10px",
          // border: "1px solid red",
        }}
      >
        {inventory && inventory < 7 ? `Only ${inventory} Left!` : ""}
      </p>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <div
          style={{
            backgroundColor: chosenFlavor.length !== 0 ? "" : "grey",
          }}
          className={classes2.addToCartBtn}
          onClick={addItemToCart}
        >
          Add to Cart
        </div>
        <SaveBtn
          product={{
            name: product.product.name,
            img: product.product.imageUrl,
          }}
        />
      </div>
    </div>
  );
}

/* {product.flavors_inventory.map((flavorInv: FlavorsInventoryObj) => {
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
      })} */
