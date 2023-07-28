"use client";
import React from "react";
import type { ProductStock } from "@/scripts/Types";
import axios from "axios";
import classes from "@/styles/Admin.module.css";

interface ProductRead extends Omit<ProductStock, "flavor" | "itemId"> {
  itemIds?: string[];
  flavors?: string[];
}

export default function Read() {
  const [update, setUpdate] = React.useState<boolean>(false);
  const [productsShown, setProductsShown] = React.useState<ProductRead[]>([]);

  // get ALL products
  React.useEffect(() => {
    (async function () {
      let productResponse = await axios({
        url: "/api/products",
        method: "POST",
        data: { method: "read", category: "all" },
      });

      let products: ProductRead[] = productResponse.data.data;

      console.log("Products READ: \n", products);

      setProductsShown(products);
    })();
  }, [update]);

  return (
    <div>
      <h1>Read Products Table</h1>
      <button onClick={() => setUpdate((prev) => !prev)}>Refresh</button>
      {productsShown.map((item, i) => (
        <ProductRow product={item} key={i} />
      ))}
    </div>
  );
}

function ProductRow({ product }: { product: ProductRead }) {
  const [isEditMode, setIsEditMode] = React.useState(false);

  if (isEditMode) {
    //EDIT MODE
    /* TO EDIT:
    - name: (has to remain unique)
    - flavor (can't be empty)
    - unitPrice (must be positive)
    - stock (must be positive)
    - imageUrl

    - description ?
    - salesPrice ?
    - category ?
    - isFeatured

    */
    return (
      <div
        style={{
          border: "1px solid green",
          padding: "20px",
          margin: "3px",
        }}
      >
        <p>SKU#:</p>
        {Array.isArray(product.itemIds) &&
          product.itemIds.map((id) => <span>{id}, </span>)}
        <p>
          Product: <strong>{product.name}</strong>
        </p>
        <p>Price: ${product.unitPrice}</p>
        {product.salesPrice && (
          <p style={{ color: "red" }}>Sale: ${product.salesPrice}</p>
        )}
        <p>Flavor: {product.flavors}</p>
        <img src={product.imageUrl} width="60" height="60" alt="image" />
        <h4 style={{ color: "blue" }}>In Stock: {product.stock}</h4>
      </div>
    );
  }

  // DISPLAY MODE
  return (
    <div
      style={{
        border: "1px solid green",
        padding: "20px",
        margin: "3px",
      }}
    >
      <p>SKU#:</p>
      {Array.isArray(product.itemIds) &&
        product.itemIds.map((id) => <span>{id}, </span>)}
      <p>
        Product: <strong>{product.name}</strong>
      </p>
      <p>Price: ${product.unitPrice}</p>
      {product.salesPrice && (
        <p style={{ color: "red" }}>Sale: ${product.salesPrice}</p>
      )}
      <p>Flavors:</p>
      <FlavorsCrud product={product} />
      <div>
        <img src={product.imageUrl} width="60" height="60" alt="image" />
      </div>
      <h4 style={{ color: "blue" }}>In Stock: {product.stock}</h4>
    </div>
  );
}

interface FlavorsProps {
  product: any;
}

function FlavorsCrud({ product }: FlavorsProps) {
  function addFlavor(newFlavor: string) {
    // use {...product}
    let payload = {
      ...product,
    };
    // delete flavors
    delete payload.flavors;
    // add flavor: newFlavor
    payload.flavor = newFlavor;

    //CREATE
    axios({
      url: "api/flavor",
      method: "POST",
      data: { method: "create", data: payload },
    })
      .then((res) => {
        console.log("added flavor: ", res);
      })
      .catch((e) => {
        console.error("Error adding flavor: ", e);
      });
  }

  function deleteFlavor(flavor: string) {
    // use product.NAME and FLAVOR to delete row
    axios({
      url: "api/flavor",
      method: "DELETE",
      data: { name: product.name, flavor },
    })
      .then((res) => {
        console.log("deleted flavor: ", res);
      })
      .catch((e) => {
        console.error("Error deleting flavor: ", e);
      });
  }
  function updateFlavor(oldFlavor: string, newFlavor: string) {
    axios({
      url: "api/flavor",
      method: "POST",
      data: {
        method: "update",
        data: {
          name: product.name,
          oldFlavor,
          newFlavor,
        },
      },
    })
      .then((res) => {
        console.log("updated flavor: ", res);
      })
      .catch((e) => {
        console.error("Error updating flavor: ", e);
      });
  }
  // things you need: productName, flavors
  return (
    <div style={{ border: "1px solid yellow" }} className={classes.flavors}>
      {product.flavors.map((flavor: string, i: number) => {
        return (
          <div
            style={{
              border: "1px solid red",
              padding: "12px",
            }}
            key={i}
          >
            <div> f: {flavor}</div>
            <button
              onClick={() => deleteFlavor(flavor)}
              style={{ color: "red" }}
            >
              X
            </button>
          </div>
        );
      })}
    </div>
  );
}
