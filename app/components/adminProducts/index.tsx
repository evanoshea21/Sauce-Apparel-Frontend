"use client";
import React from "react";
import Create from "./Create";
import ReadUpdateDelete from "./ReadUpdateDelete";

export default function AdminProductCRUD() {
  const [refreshList, setRefreshList] = React.useState(false);
  return (
    <>
      <Create setRefreshList={setRefreshList} />
      <ReadUpdateDelete refreshList={refreshList} />
    </>
  );
}
