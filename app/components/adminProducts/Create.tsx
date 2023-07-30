"use client";
import React from "react";
import axios from "axios";

interface CreateProductPayload {
  product: {
    name: string;
    unitPrice: string;
    imageUrl: string;

    description?: string;
    salesPrice?: string;
    category?: string;
    isFeatured: boolean;
    inventory: number;
  };
  flavors_stock: { flavor: string; inventory: number; salesPrice?: string }[];
}

interface CreateProps {
  formValues?: CreateProductPayload;
  setRefreshList: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Create({ formValues, setRefreshList }: CreateProps) {
  // Form inputs
  const [name, setName] = React.useState<string>("");
  const [unitPrice, setUnitPrice] = React.useState<string>("");
  const [imageUrl, setImageUrl] = React.useState<string>("");
  const [inventory, setInventory] = React.useState<number>(0);
  const [description, setDescription] = React.useState<string>("");
  const [salesPrice, setSalesPrice] = React.useState<string | undefined>(
    undefined
  );
  const [category, setCategory] = React.useState<string | undefined>(undefined);
  const [isFeatured, setIsFeatured] = React.useState<boolean>(false);

  function handleForm(e: any) {
    e.preventDefault();
    const dataPayload: CreateProductPayload = {
      product: {
        name,
        unitPrice,
        imageUrl,
        description,
        salesPrice,
        category,
        isFeatured,
        inventory,
      },
      flavors_stock: [
        { flavor: "peach", inventory: 24, salesPrice: "14.99" },
        { flavor: "orange", inventory: 25, salesPrice: "14.99" },
        { flavor: "blue", inventory: 26, salesPrice: undefined },
      ], // make sure to map these in
    };

    // [TODO] DONT ALLOW CREATION OF PRODUCT WITH SAME NAME. Do read first, make sure results are empty

    // console.log("Data Payload (create product): \n", dataPayload);
    // return;

    axios({
      url: "/api/products",
      method: "POST",
      data: {
        method: "create",
        data: dataPayload,
      },
    })
      .then((res) => {
        console.log("Create Res: ", res.data);
        setRefreshList((prev) => !prev);
      })
      .catch((e) => console.error("Error Create: ", e));
  }
  return (
    <div>
      <h1>Create Product</h1>
      <form onSubmit={handleForm}>
        <label htmlFor="adminProductCreate_name">Name</label>
        <input
          required
          id="adminProductCreate_name"
          placeholder="name"
          name="name"
          type="text"
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="adminProductCreate_unitPrice">UnitPrice</label>
        <input
          required
          id="adminProductCreate_unitPrice"
          placeholder="unitPrice"
          name="unitPrice"
          type="text"
          onChange={(e) => setUnitPrice(e.target.value)}
        />

        <label htmlFor="adminProductCreate_stock">Stock</label>
        <input
          required
          id="adminProductCreate_stock"
          placeholder="stock"
          name="stock"
          type="text"
          onChange={(e) => setInventory(Number(e.target.value))}
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
          onChange={(e) => setSalesPrice(e.target.value)}
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
