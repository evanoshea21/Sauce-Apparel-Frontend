"use client";
import React from "react";
import classes from "@/styles/ui_css/TextInput.module.css";
import classes2 from "@/styles/ui_css/CreditInput.module.css";
import $ from "jquery";

interface Props {
  color?: string;
  label: string;
  fontScale?: number;
  widthHeightScale?: number;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  defaultValue?: string;
  display?: "inline-block" | "block";
}

export default function TextInput(props: Props) {
  const [formId] = React.useState<string>(`credit-card-number-input`);
  // const [value, setValue] = React.useState<string | undefined>();
  const [isFocused, setIsFocused] = React.useState<boolean>(false);

  React.useEffect(() => {
    $("#credit-card-number-input").on("keypress change", function () {
      $(this).val(function (index, value) {
        return value.replace(/\W/gi, "").replace(/(.{4})/g, "$1 ");
      });
    });

    return () => {
      $("#credit-card-number-input").off("keypress change");
    };
  }, []);

  return (
    <div
      className={classes.main}
      style={{
        fontSize: `${1}rem`,
        // fontSize: `${props.fontScale ?? 1}rem`,
        display: props.display,
      }}
    >
      <label className={`${classes.label} ${classes2.label}`} htmlFor={formId}>
        {props.label}
      </label>
      <input
        className={`${classes.input} ${classes2.input}`}
        style={{
          width: `${12 * (props.widthHeightScale ?? 1)}em`,
          height: `${1 * (0.4 * (props.widthHeightScale ?? 1))}em`,
          color: props.color ?? "rgb(50, 50, 50)",
        }}
        id={formId}
        name={formId}
        required={false}
        type="tel"
        // value={value}
        maxLength={23}
        placeholder="xxxx xxxx xxxx xxxx"
        onChange={(e) => {
          // console.log("val: ", e.target.value);
          props.onChange(e.target.value.split(" ").join(""));
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
}
