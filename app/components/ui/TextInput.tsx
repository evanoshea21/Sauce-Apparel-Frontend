"use client";
import React from "react";
import classes from "@/styles/ui_css/TextInput.module.css";

interface Props {
  color?: string;
  inputId: string;
  fontScale?: number;
  widthHeightScale?: number;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  defaultValue?: string;
  display?: "inline-block" | "block";
}

export default function Working(props: Props) {
  const [formId] = React.useState<string>(`input-${props.inputId}`);
  const [value, setValue] = React.useState<string | undefined>(
    props.defaultValue ?? ""
  );
  const [isFocused, setIsFocused] = React.useState<boolean>(false);
  const [animClass, setAnimClass] = React.useState<"up" | "down">("down");

  //change animation based on Value and Focus
  React.useEffect(() => {
    // if there's a value.length, animateUp
    if (value && value.length) {
      setAnimClass("up");
    }
    // if there is focus, animateUp
    else if (isFocused) {
      setAnimClass("up");
    } else {
      setAnimClass("down");
    }
    // if no value, no focus, animateDown
  }, [value, isFocused]);

  return (
    <div
      className={classes.main}
      style={{
        fontSize: `${props.fontScale ?? 1}rem`,
        display: props.display,
      }}
    >
      <label
        className={`${classes.label} ${
          animClass === "up" ? classes.animateUp : classes.animateDown
        }`}
        htmlFor={formId}
      >
        {props.placeholder}
      </label>
      <input
        className={classes.input}
        style={{
          width: `${12 * (props.widthHeightScale ?? 1)}em`,
          height: `${1 * (0.4 * (props.widthHeightScale ?? 1))}em`,
          color: props.color ?? "rgb(50, 50, 50)",
        }}
        id={formId}
        name={formId}
        required={false}
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          props.onChange(e.target.value);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
}
