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

export default function ExpDateInput(props: Props) {
  const [formId] = React.useState<string>(`credit-card-expDate-input`);
  const [val, setVal] = React.useState<string>("");
  // const [value, setValue] = React.useState<string | undefined>();
  const [isFocused, setIsFocused] = React.useState<boolean>(false);
  React.useEffect(() => {
    $("#credit-card-expDate-input").on("keypress change", function () {
      $(this).val(function (index, value) {
        return value.replace(/\W/gi, "").replace(/(.{2})/, "$1/");
      });
    });

    return () => {
      $("#credit-card-expDate-input").off("keypress change");
    };
  }, []);

  return (
    <div
      className={classes2.main}
      style={{
        // fontSize: `${1}rem`,
        fontSize: `${props.fontScale ?? 1}rem`,
        display: props.display,
      }}
    >
      <label className={`${classes.label} ${classes2.label}`} htmlFor={formId}>
        Exp. Date
      </label>

      <input
        className={`${classes.input} ${classes2.input} ${
          val.length !== 0 && classes2.inputExp
        } ${val.length == 0 && classes2.inputExpPlaceholder}`}
        style={{
          width: `${5 * (props.widthHeightScale ?? 1)}em`,
          height: `${1 * (0.4 * (props.widthHeightScale ?? 1))}em`,
          color: props.color ?? "rgb(50, 50, 50)",
        }}
        id={formId}
        name={formId}
        required={false}
        type="tel"
        maxLength={5}
        placeholder="MM/YY"
        onChange={(e) => {
          // console.log("val: ", e.target.value.split(" ").join(""));
          setVal(e.target.value);
          props.onChange(e.target.value.split(" ").join(""));
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
}
