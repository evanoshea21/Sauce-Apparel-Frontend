"use client";
import React from "react";
import classes from "@/styles/Cart.module.css";
import { changeQuantityCart, getCartItems, getCartSum } from "@/app/utils";
import type { CartItem } from "@/scripts/Types";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
/*
Sole purpose: GET/EDIT cart items from localStorage

CLEAN

Left to do:
- ui (styling table)
- add quantity controls (that MUST edit localStorage)

*/

export default function Cart() {
  const [totalPrice, setTotalPrice] = React.useState<number>();
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [quantities, setQuantities] = React.useState<{ [key: string]: string }>(
    {}
  );

  // GET SET cart items from LocalStorage
  React.useEffect(() => {
    setCartItems(getCartItems());
  }, []);

  React.useEffect(() => {
    if (cartItems) {
      // set the Qs state
      let obj: { [key: string]: string } = {};
      cartItems.forEach((item: CartItem) => {
        obj[item.sku] = item.quantity;
      });
      setQuantities(obj);
    }
  }, [cartItems]);

  //set SUM price of cart items
  React.useEffect(() => {
    setTotalPrice(getCartSum());
  }, [cartItems]);

  function removeFromCart(sku: string) {
    // filter out the itemId
    const newCartItems = cartItems.filter((item: CartItem) => item.sku !== sku);
    setCartItems(newCartItems);
    // set new
    localStorage.setItem("cart_items", JSON.stringify(newCartItems));
  }

  function changeQuantity(sku: string, newQ: number) {
    const item = cartItems.find((item) => item.sku === sku);
    if (newQ > Number(item?.maxQuantity) || newQ < 1) return;
    setQuantities((prevQs) => {
      let newQs = { ...prevQs };
      newQs[sku] = String(newQ);
      return newQs;
    });
    changeQuantityCart(sku, newQ);
  }

  if (cartItems.length === 0) {
    return <>Empty Cart...</>;
  }

  return (
    <>
      <h1>Shopping Cart</h1>
      <div className={classes.main}>
        {cartItems.map((item: CartItem) => {
          return (
            <div key={item.sku}>
              <div className={classes.cartRow}>
                <div className={classes.product}>
                  <div className={classes.imgBoxRow}>
                    <img src={item.img} alt="product image" />
                  </div>
                  <div className={classes.nameFlavor}>
                    <h3>{item.name}</h3>
                    <p>{item.description.split(":")[1].trim()}</p>
                  </div>
                </div>
                <div className={classes.quantity}>
                  <ChangeQuantity
                    sku={item.sku}
                    currentQ={Number(quantities[item.sku]) || 0}
                    maxQuantity={Number(item.maxQuantity) || 0}
                    changeQuantity={changeQuantity}
                  />
                </div>
                <div className={classes.price}>
                  <span
                  // style={{ color: "grey", fontSize: "1rem" }}
                  >
                    ${" "}
                  </span>
                  {item.unitPrice}
                </div>
                <div
                  className={classes.delete}
                  onClick={() => removeFromCart(item.sku)}
                >
                  <DeleteOutlineIcon />
                </div>
              </div>
              {/* SMALL ROW */}
              <div className={classes.cartRowMobile}>
                <div className={classes.imgBoxRowSm}>
                  <img src={item.img} alt="product image" />
                </div>
                <div className={classes.right}>
                  <div className={classes.top}>
                    <div className={classes.nameFlavorSm}>
                      <h3>SMALL {item.name}</h3>
                      <p>{item.description.split(":")[1].trim()}</p>
                    </div>
                    <div
                      className={classes.deleteSm}
                      onClick={() => removeFromCart(item.sku)}
                    >
                      <DeleteOutlineIcon />
                    </div>
                  </div>
                  <div className={classes.bottom}>
                    <div className={classes.priceSm}>
                      <span>$ </span>
                      {item.unitPrice}
                    </div>
                    <div className={classes.quantitySm}>
                      <ChangeQuantity
                        sku={item.sku}
                        currentQ={Number(quantities[item.sku]) || 0}
                        maxQuantity={Number(item.maxQuantity) || 0}
                        changeQuantity={changeQuantity}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={classes.line}></div>
            </div>
          );
        })}
      </div>
    </>
  );
}

interface ChangeQProps {
  sku: string;
  currentQ: number;
  changeQuantity: (sku: string, newQ: number) => void;
  maxQuantity: number;
}

function ChangeQuantity({
  sku,
  currentQ,
  changeQuantity,
  maxQuantity,
}: ChangeQProps) {
  return (
    <div className={classes.changeQBox}>
      <span
        className={classes.plusMinus}
        style={{ color: currentQ === 1 ? "grey" : "" }}
        onClick={() => changeQuantity(sku, currentQ - 1)}
      >
        -
      </span>
      <span>{currentQ}</span>
      <span
        className={classes.plusMinus}
        style={{ color: currentQ === maxQuantity ? "grey" : "" }}
        onClick={() => changeQuantity(sku, currentQ + 1)}
      >
        +
      </span>
    </div>
  );
}
