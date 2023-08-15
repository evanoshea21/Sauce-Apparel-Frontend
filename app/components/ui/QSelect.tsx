"use client";
import React from "react";
import classes from "@/styles/Cart.module.css";
interface Props {
  changeQuantity: React.Dispatch<React.SetStateAction<number>>;
  maxQuantity: number;
  value: number;
}

export default function QuantitySelect({
  changeQuantity,
  maxQuantity,
  value,
}: Props) {
  const [quantity, setQuantity] = React.useState(1);

  React.useEffect(() => {
    setQuantity(value);
  }, [value]);

  function handleQChange(type: "up" | "down") {
    if (type === "down") {
      if (quantity !== 1) {
        let newQ = quantity - 1;
        setQuantity(newQ);
        changeQuantity(newQ);
      }
    } else {
      // up
      if (quantity !== maxQuantity) {
        let newQ = quantity + 1;
        setQuantity(newQ);
        changeQuantity(newQ);
      }
    }
  }
  return (
    <div
      style={{
        maxWidth: "150px",
        flex: "1",
        // border: "1px solid green",
        zIndex: "100",
      }}
    >
      <span>Select Quantity</span>
      <div className={classes.changeQBox}>
        <span
          className={classes.plusMinus}
          style={{ color: quantity === 1 ? "grey" : "" }}
          onClick={() => {
            handleQChange("down");
          }}
        >
          -
        </span>
        <span>{quantity}</span>
        <span
          className={classes.plusMinus}
          style={{ color: quantity === maxQuantity ? "grey" : "" }}
          onClick={() => {
            handleQChange("up");
          }}
        >
          +
        </span>
      </div>
    </div>
  );
}
