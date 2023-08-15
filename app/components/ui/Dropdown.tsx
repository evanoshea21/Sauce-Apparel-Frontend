"use client";
import React from "react";
import classes from "@/styles/ui_css/Dropdown.module.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface Props {
  values: string[];
  handleChange: React.Dispatch<React.SetStateAction<string>>;
}

export default function Dropdown({ values, handleChange }: Props) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [selection, setSelection] = React.useState<string>("");
  const [fontSize, setFontSize] = React.useState<string>("1rem");
  const [selectionText, setSelectionText] = React.useState<string>();

  React.useEffect(() => {
    handleChange(selection);
    if (selection.length > 34) {
      setSelectionText(selection.slice(0, 34) + "...");
      setFontSize(".9rem");
    } else {
      setSelectionText(selection);
      setFontSize("1rem");
    }
  }, [selection]);

  return (
    <div className={classes.main}>
      <span>Select Flavor</span>
      <div onClick={() => setOpen((prev) => !prev)} className={classes.select}>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontSize, textAlign: "center" }}>
            {selectionText ? selectionText : "Choose a flavor"}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              transform: `rotate(${open ? "180" : "0"}deg)`,
            }}
          >
            <KeyboardArrowDownIcon />
          </div>
        </div>

        <div
          className={classes.dropdown}
          style={{ display: open ? "block" : "none" }}
        >
          {values.map((flavor, i) => (
            <>
              <div
                className={classes.option}
                key={flavor}
                style={{
                  backgroundColor:
                    selection === flavor ? "rgba(188, 185, 185, 0.335)" : "",
                }}
                onClick={() => setSelection(flavor)}
              >
                {flavor}
              </div>
              <div className={classes.border}></div>
            </>
          ))}
          <div className={classes.fade}></div>
        </div>
      </div>
      {/* <div
        onClick={() => console.log("clicked outside")}
        className={classes.blocker}
      ></div> */}
    </div>
  );
}
