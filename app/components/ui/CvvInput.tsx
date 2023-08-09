"use client";
import React from "react";
import classes from "@/styles/ui_css/TextInput.module.css";
import classes2 from "@/styles/ui_css/CreditInput.module.css";
import $ from "jquery";

interface Props {
  color?: string;
  fontScale?: number;
  widthHeightScale?: number;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  display?: "inline-block" | "block";
}

export default function CvvInput(props: Props) {
  const [formId] = React.useState<string>(`credit-card-cvv-input`);
  // const [value, setValue] = React.useState<string | undefined>();

  return (
    <div
      className={classes.main}
      style={{
        // fontSize: `${1}rem`,
        paddingTop: "10px",
        fontSize: `${props.fontScale ?? 1}rem`,
        display: props.display,
      }}
    >
      <label className={`${classes.label} ${classes2.label}`} htmlFor={formId}>
        CVV
      </label>

      <input
        className={`${classes.input} ${classes2.input} ${classes2.inputCvv}`}
        style={{
          width: `${2 * (props.widthHeightScale ?? 1)}em`,
          height: `${1 * (0.4 * (props.widthHeightScale ?? 1))}em`,
          color: props.color ?? "rgb(50, 50, 50)",
        }}
        id={formId}
        name={formId}
        required={false}
        type="tel"
        maxLength={3}
        placeholder="123"
        onChange={(e) => {
          // console.log("val: ", e.target.value.split(" ").join(""));
          props.onChange(e.target.value);
        }}
      />
    </div>
  );
}
