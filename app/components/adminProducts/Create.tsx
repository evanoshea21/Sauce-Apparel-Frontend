"use client";
import React from "react";
import type { ProductStock } from "@/scripts/Types";
import axios from "axios";

export default function Create() {
  // Form inputs
  const [itemId, setItemId] = React.useState<string>("");
  const [name, setName] = React.useState<string>("");
  const [flavor, setFlavor] = React.useState<string>("");
  const [unitPrice, setUnitPrice] = React.useState<number>(0);
  const [stock, setStock] = React.useState<number>(0);
  const [imageUrl, setImageUrl] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [salesPrice, setSalesPrice] = React.useState<number | undefined>(
    undefined
  );
  const [category, setCategory] = React.useState<string | undefined>(undefined);
  const [isFeatured, setIsFeatured] = React.useState<boolean>(false);

  function handleForm(e: any) {
    e.preventDefault();
    const dataPayload: ProductStock = {
      itemId,
      name,
      flavor,
      unitPrice,
      stock,
      imageUrl,
      description,
      salesPrice,
      category,
      isFeatured,
    };

    console.log("Data Payload (create product): \n", dataPayload);

    axios({
      url: "/api/products",
      method: "POST",
      data: {
        method: "create",
        data: dataPayload,
      },
    })
      .then((res) => console.log("Create Res: ", res.data))
      .catch((e) => console.error("Error Create: ", e));
  }
  return (
    <div>
      <h1>Create Product</h1>
      <form onSubmit={handleForm}>
        <label htmlFor="adminProductCreate_itemId">ItemId</label>
        <input
          required
          id="adminProductCreate_itemId"
          placeholder="Item Id"
          name="itemId"
          type="text"
          onChange={(e) => setItemId(e.target.value)}
        />

        <label htmlFor="adminProductCreate_name">Name</label>
        <input
          required
          id="adminProductCreate_name"
          placeholder="name"
          name="name"
          type="text"
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="adminProductCreate_flavor">Flavor</label>
        <input
          required
          id="adminProductCreate_flavor"
          placeholder="flavor"
          name="flavor"
          type="text"
          onChange={(e) => setFlavor(e.target.value)}
        />

        <label htmlFor="adminProductCreate_unitPrice">UnitPrice</label>
        <input
          required
          id="adminProductCreate_unitPrice"
          placeholder="unitPrice"
          name="unitPrice"
          type="text"
          onChange={(e) => setUnitPrice(Number(e.target.value))}
        />

        <label htmlFor="adminProductCreate_stock">Stock</label>
        <input
          required
          id="adminProductCreate_stock"
          placeholder="stock"
          name="stock"
          type="text"
          onChange={(e) => setStock(Number(e.target.value))}
        />

        <label htmlFor="adminProductCreate_imageUrl">ImageUrl</label>
        <input
          required
          id="adminProductCreate_imageUrl"
          placeholder="imageUrl"
          name="imageUrl"
          type="text"
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <label htmlFor="adminProductCreate_description">Desccription?</label>
        <input
          id="adminProductCreate_description"
          placeholder="description"
          name="description"
          type="text"
          onChange={(e) => setDescription(e.target.value)}
        />

        <label htmlFor="adminProductCreate_salesPrice">Sales Price?</label>
        <input
          id="adminProductCreate_salesPrice"
          placeholder="salesPrice"
          name="salesPrice"
          type="text"
          onChange={(e) => setSalesPrice(Number(e.target.value))}
        />

        <label htmlFor="adminProductCreate_category">Category?</label>
        <input
          id="adminProductCreate_category"
          placeholder="category"
          name="category"
          type="text"
          onChange={(e) => setCategory(e.target.value)}
        />

        <label htmlFor="adminProductCreate_isFeatured">Is Featured?</label>
        <input
          id="adminProductCreate_isFeatured"
          placeholder="isFeatured"
          name="isFeatured"
          type="number"
          onChange={(e) => setIsFeatured(!!e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
