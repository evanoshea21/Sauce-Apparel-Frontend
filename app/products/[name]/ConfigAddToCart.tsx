"use client";
import React from "react";
import type { Product, SizesInventoryObj, CartItem } from "@/scripts/Types";
import { addToCart, getQOfItem } from "@/app/utils";
//MUI

import classes from "@/styles/DetailsPage.module.css";
import classes2 from "@/styles/ProductCard.module.css";
import Dropdown from "@/app/components/ui/Dropdown";
import QSelect from "@/app/components/ui/QSelect";
import { SaveBtn } from "../../components/ClientElements";
import { useRouter } from "next/navigation";
import { Context } from "@/app/Context";

/*
Purpose:
- gather product data (props)
- hold state for SIZE and QUANITY
- transmute data to cartItem + max-quanity
- add to cart (utils.ts)
*/

interface Props {
  product: Product;
}
export default function AddToCart({ product }: Props) {
  const router = useRouter();
  const { refreshCart } = React.useContext(Context);
  const [chosenSize, setChosenSize] = React.useState<string>("");
  const [chosenSku, setChosenSku] = React.useState<string>("");
  const [chosenQuantity, setChosenQuantity] = React.useState<number>(1);
  const [inventory, setInventory] = React.useState<number>();
  const [disabled, setDisabled] = React.useState<boolean>(true);
  const [determinedPrice, setDeterminedPrice] = React.useState<string>("");

  const [sizesArr, setSizesArr] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (chosenSize?.length === 0 || !product.Sizes_Inventory) return;
    setDisabled(false);
    setChosenQuantity(1);
    //set sku, AND inventory (for cart later)
    let sizeRow: SizesInventoryObj | undefined = product.Sizes_Inventory.find(
      (product) => chosenSize === product.size
    );
    setInventory(Number(sizeRow?.inventory));
    setChosenSku(sizeRow?.sku ?? "");
  }, [chosenSize]);

  React.useEffect(() => {
    if (product) {
      setDeterminedPrice(
        product.salesPrice && product.salesPrice.length
          ? product.salesPrice
          : product.unitPrice
      );
      // set sizes array (for dropdown)
      const arr: string[] = [];
      if (!product.Sizes_Inventory) return;
      product.Sizes_Inventory.forEach((sizeInv) => {
        if (sizeInv.inventory > 0) {
          arr.push(sizeInv.size);
        }
      });
      setSizesArr(arr);
    }
  }, [product]);

  function addItemToCart() {
    if (chosenSize.length === 0) return;
    //transmute data
    const cartItem: CartItem = {
      sku: chosenSku,
      name: product.name,
      quantity: String(chosenQuantity),
      unitPrice: determinedPrice,
      description: `Size: ${chosenSize}`,
      img: product.imageUrl,
      maxQuantity: String(inventory),
    };

    //add to cart
    addToCart(cartItem);
    // refresh cart global
    refreshCart();
    router.push("/");
  }

  if (sizesArr.length === 0) {
    return (
      <div
        style={{
          margin: "30px 0",
          color: "red",
          fontSize: "1.4rem",
        }}
      >
        Product Out of Stock
      </div>
    );
  }

  return (
    <div>
      <div className={classes.configSizeAndQuantity}>
        <Dropdown handleChange={setChosenSize} values={sizesArr} />
        <div style={{ zIndex: "0" }}>
          <QSelect
            value={chosenQuantity}
            changeQuantity={setChosenQuantity}
            maxQuantity={inventory ? inventory - getQOfItem(chosenSku) : 1}
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
            backgroundColor: chosenSize.length !== 0 ? "" : "grey",
            fontSize: ".95em",
            padding: ".8em 2em",
          }}
          className={classes2.addToCartBtn}
          onClick={addItemToCart}
        >
          Add to Cart
        </div>
        <SaveBtn
          product={{
            name: product.name,
            img: product.imageUrl,
          }}
        />
      </div>
    </div>
  );
}

/* {product.sizes_inventory.map((sizeInv: SizesInventoryObj) => {
        return (
          <div
            onClick={() => {
              setChosenSize({
                sku: sizeInv.sku ?? "",
                size: sizeInv.size,
              });
              setInventory(sizeInv.inventory);
            }}
            style={{
              border: "1px solid rgb(55, 64, 57)",
              backgroundColor:
                chosenSize.size === sizeInv.size ? "grey" : "",
            }}
          >
            <p>Size: {sizeInv.size}</p>
            <p>Inventory: {sizeInv.inventory}</p>
          </div>
        );
      })} */
