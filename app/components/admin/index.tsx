"use client";
import React from "react";
import ReadUpdateDelete from "./ReadUpdateDelete";
import Sidebar from "./Sidebar";
import classes from "@/styles/Admin.module.css";

export default function AdminClient() {
  return (
    <div className={classes.clientBox}>
      <Sidebar />
      <ReadUpdateDelete />;
    </div>
  );
}
