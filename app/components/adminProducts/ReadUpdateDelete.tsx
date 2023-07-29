"use client";
import React from "react";
import type { ProductStock } from "@/scripts/Types";
import axios from "axios";
import classes from "@/styles/Admin.module.css";

interface ProductRead extends Omit<ProductStock, "flavor" | "id"> {
  ids?: string[];
  flavors?: string[];
}

export default function Read({ refreshList }: { refreshList: boolean }) {
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

      setProductsShown(products.reverse());
    })();
  }, [update, refreshList]);

  async function refreshRow(isDelete: boolean, name: string) {
    if (isDelete) {
      setProductsShown((prevProductArr) => {
        let arr = prevProductArr.slice().filter((product) => {
          return product.name !== name;
        });
        return arr;
      });
      return;
    }
    // get product at name=
    let response = await axios({
      url: "/api/products",
      method: "POST",
      data: {
        method: "read",
        name,
      },
    });

    setProductsShown((prevProductArr) => {
      let arr = prevProductArr.slice();
      // find index where name = name
      let foundIndex: number = 0;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].name === name) {
          foundIndex = i;
          break;
        }
      }
      // replace index with response.data
      console.log("response REFRESH: ", response.data.data[0]);
      arr[foundIndex] = response.data.data[0];
      return arr;
    });
  }

  return (
    <div>
      <h1>Read Products Table</h1>
      <button onClick={() => setUpdate((prev) => !prev)}>Refresh</button>
      {productsShown.map((item, i) => (
        <ProductRow refreshRow={refreshRow} product={item} key={i} row={i} />
      ))}
    </div>
  );
}

interface ProductRowProps {
  product: ProductRead;
  row: number;
  refreshRow: (isDelete: boolean, name: string) => Promise<void>;
}

function ProductRow({ product, row, refreshRow }: ProductRowProps) {
  const [isEditMode, setIsEditMode] = React.useState(false);

  function deleteEntireProduct() {
    axios({
      url: "api/products",
      method: "DELETE",
      data: { name: product.name },
    })
      .then((res) => {
        console.log("IT WORKED! deleted");
        console.log(res.data);
        // SPLICE row
        refreshRow(true, product.name);
      })
      .catch((err) => {
        console.error(err);
      });
  }

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
        {Array.isArray(product.ids) &&
          product.ids.map((id) => <span key={id}>{id}, </span>)}
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
      {Array.isArray(product.ids) &&
        product.ids.map((id) => <span key={id}>{id}, </span>)}
      <p>
        Product: <strong>{product.name}</strong>
      </p>
      <p>Price: ${product.unitPrice}</p>
      {product.salesPrice && (
        <p style={{ color: "red" }}>Sale: ${product.salesPrice}</p>
      )}
      <p>Flavors:</p>
      <FlavorsCrud row={row} refreshRow={refreshRow} product={product} />
      <div>
        <img src={product.imageUrl} width="60" height="60" alt="image" />
      </div>
      <h4 style={{ color: "blue" }}>In Stock: {product.stock}</h4>
      <button onClick={deleteEntireProduct} style={{ color: "red" }}>
        Delete ENTIRE PRODUCT
      </button>
    </div>
  );
}

interface FlavorsProps {
  product: any;
  row: number;
  refreshRow: (isDelete: boolean, name: string) => Promise<void>;
}

function FlavorsCrud({ product, row, refreshRow }: FlavorsProps) {
  const [flavorsString, setFlavorsString] = React.useState<string>("");
  const [updatedFlavor, setUpdatedFlavor] = React.useState<string>("");
  const [flavorToEdit, setFlavorToEdit] = React.useState<string | undefined>();

  function addFlavors() {
    if (flavorsString.length === 0) return;

    let flavorsToAdd = flavorsString.split(",");
    // use {...product}
    let payload = {
      ...product,
    };
    // replace flavors
    payload.flavors = flavorsToAdd;
    // delete unnecessary ids (they'll be auto-generated by prisma)
    delete payload.ids;

    console.log("Add Flavor Payload: ", payload);

    //CREATE
    axios({
      url: "api/flavor",
      method: "POST",
      data: { method: "create", data: payload },
    })
      .then((res) => {
        console.log("added flavor: ", res);
        refreshRow(false, product.name);
      })
      .catch((e) => {
        console.error("Error adding flavor: ", e);
      });
  }

  function deleteFlavor(skuIndex: number) {
    // use product.NAME and FLAVOR to delete row
    const id = product.ids[skuIndex];
    axios({
      url: "api/flavor",
      method: "DELETE",
      data: { id },
    })
      .then((res) => {
        console.log("deleted flavor: ", res);
        refreshRow(false, product.name);
      })
      .catch((e) => {
        console.error("Error deleting flavor: ", e);
      });
  }

  function updateFlavor() {
    axios({
      url: "api/flavor",
      method: "POST",
      data: {
        method: "update",
        data: {
          name: product.name,
          oldFlavor: flavorToEdit,
          newFlavor: updatedFlavor,
        },
      },
    })
      .then((res) => {
        console.log("updated flavor: ", res);
        setFlavorToEdit(undefined);
        setUpdatedFlavor("");
        refreshRow(false, product.name);
      })
      .catch((e) => {
        console.error("Error updating flavor: ", e);
      });
  }

  return (
    <div style={{ border: "1px solid yellow" }} className={classes.flavors}>
      {Array.isArray(product.flavors) &&
        product.flavors.map((flavor: string, i: number) => {
          return (
            <div
              style={{
                border: "1px solid red",
                padding: "12px",
              }}
              key={i}
            >
              {flavorToEdit === flavor ? (
                <>
                  <input
                    type="text"
                    onChange={(e) => setUpdatedFlavor(e.target.value)}
                    defaultValue={flavorToEdit}
                  />
                  <button onClick={updateFlavor} style={{ color: "green" }}>
                    ✔️
                  </button>
                </>
              ) : (
                <div onClick={() => setFlavorToEdit(flavor)}> f: {flavor}</div>
              )}
              <button onClick={() => deleteFlavor(i)} style={{ color: "red" }}>
                X
              </button>
            </div>
          );
        })}
      {/* OUTSIDE MAP NOW */}

      <div>
        <label htmlFor="add-flavor">Add Flavor</label>
        <input
          id="add-flavor"
          name="add-flavor"
          type="text"
          placeholder="separate by commas (ie: Peach,Apple,Orange...)"
          onChange={(e) => setFlavorsString(e.target.value)}
        />
        <button onClick={addFlavors}>Add Flavor(s)</button>
      </div>
    </div>
  );
}
