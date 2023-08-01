"use client";
import React from "react";
import type { Product } from "@/scripts/Types";
import axios from "axios";
import classes from "@/styles/Admin.module.css";
import { Flavors } from "next/font/google";
import { FlavorsInventoryForm } from "../forms/ProductFlavorsForms";
import type { FlavorsInventoryObj } from "@/scripts/Types";

//Product (everything) vs ProductData (only the product's data)

interface ProductData {
  id?: string; //optional bc CREATE payload doesn't need it
  name: string;
  unitPrice: string;
  imageUrl: string;

  description: string | null;
  inventory: number | null; //if no flavors
  salesPrice: string | null; // if no flavors
  category: string | null;
  isFeatured?: boolean;
}

export default function Read({ refreshList }: { refreshList: boolean }) {
  const [update, setUpdate] = React.useState<boolean>(false);
  const [productsShown, setProductsShown] = React.useState<Product[]>([]);

  // get ALL products
  React.useEffect(() => {
    (async function () {
      let productResponse = await axios({
        url: "/api/products",
        method: "POST",
        data: { method: "read" },
      });
      console.log("Products READ: \n", productResponse.data);
      setProductsShown(productResponse.data.reverse());
    })();
  }, [update, refreshList]);

  async function refreshRow(isDelete: boolean, productId: string) {
    // if deleting, find where product id
    if (isDelete) {
      setProductsShown((prevProductArr) => {
        let arr = prevProductArr.slice().filter((product) => {
          return product.product.id !== productId;
        });
        return arr;
      });
      return;
    }

    // get product to refresh
    let response = await axios({
      url: "/api/products",
      method: "POST",
      data: {
        method: "read",
        id: productId,
      },
    });
    console.log("response REFRESH: ", response.data);

    setProductsShown((prevProductArr) => {
      let arr = prevProductArr.slice();
      // find index where name = name
      let foundIndex: number = 0;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].product.id === productId) {
          foundIndex = i;
          break;
        }
      }
      // replace index with response.data
      arr[foundIndex] = response.data[0];
      return arr;
    });
  }

  return (
    <div>
      <h1>Read Products Table</h1>
      <button onClick={() => setUpdate((prev) => !prev)}>Refresh</button>
      {productsShown.map((item, i) => (
        <ProductRow refreshRow={refreshRow} product={item} key={i} />
      ))}
    </div>
  );
}

interface ProductRowProps {
  product: Product;
  refreshRow: (isDelete: boolean, productId: string) => Promise<void>;
}

function ProductRow({ product, refreshRow }: ProductRowProps) {
  const [isEditMode, setIsEditMode] = React.useState(false);

  function deleteEntireProduct() {
    axios({
      url: "api/products",
      method: "DELETE",
      data: { id: product.product.id },
    })
      .then((res) => {
        console.log("IT WORKED! deleted");
        console.log(res.data);
        // SPLICE row
        refreshRow(true, product.product.id || "");
      })
      .catch((err) => {
        console.error(err);
      });
  }

  if (!product) return <></>;

  return (
    <div
      style={{
        border: "1px solid green",
        padding: "20px",
        margin: "3px",
      }}
    >
      <p>SKU#:</p>
      {Array.isArray(product.flavors_inventory) &&
        product.flavors_inventory.map((item) => (
          <span key={item.sku}>{item.sku}, </span>
        ))}
      <p>
        Product: <strong>{product.product.name}</strong>
      </p>
      <p>Price: ${product.product.unitPrice}</p>
      {product.product.salesPrice && (
        <p style={{ color: "red" }}>Sale: ${product.product.salesPrice}</p>
      )}
      <p>Flavors:</p>
      <FlavorsCrud
        refreshRow={refreshRow}
        productData={product.product}
        flavors_inventory={product.flavors_inventory}
      />
      <div>
        <img
          src={product.product.imageUrl}
          width="60"
          height="60"
          alt="image"
        />
      </div>

      <button onClick={deleteEntireProduct} style={{ color: "red" }}>
        Delete ENTIRE PRODUCT
      </button>
    </div>
  );
}

interface FlavorsProps {
  productData: ProductData;
  flavors_inventory: FlavorsInventoryObj[];
  refreshRow: (isDelete: boolean, productId: string) => Promise<void>;
}

function FlavorsCrud({
  productData,
  flavors_inventory,
  refreshRow,
}: FlavorsProps) {
  const [showFlavorForm, setShowFlavorForm] = React.useState<boolean>(false);
  const [updatedStock, setUpdatedStock] = React.useState<string>("");
  const [stockToEditByFlavor, setStockToEditByFlavor] = React.useState<
    string | undefined
  >();
  const [flavorsInvSalesPriceArr, setFlavorsInvSalesPriceArr] = React.useState<
    FlavorsInventoryObj[]
  >([]);

  function addFlavorsInv() {
    console.log("Payload add FlavorsInv: \n", flavorsInvSalesPriceArr);
    const payload = flavorsInvSalesPriceArr;
    payload.forEach((row) => {
      row.productId = productData.id || "";
    });

    //CREATE
    axios({
      url: "api/flavor",
      method: "POST",
      data: { method: "create", data: payload },
    })
      .then((res) => {
        console.log("added flavor: ", res);
        refreshRow(false, productData.id || "");
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
      data: { productId: productData.id, flavor },
    })
      .then((res) => {
        console.log("deleted flavor: ", res.data);
        refreshRow(false, productData.id || "");
      })
      .catch((e) => {
        console.error("Error deleting flavor: ", e);
      });
  }

  function updateStock() {
    if (updatedStock === "" || !updatedStock) {
      setStockToEditByFlavor(undefined);
      setUpdatedStock("");
      return;
    }

    axios({
      url: "api/flavor",
      method: "POST",
      data: {
        method: "update_inventory",
        productId: productData.id,
        flavor: stockToEditByFlavor,
        newInventory: Number(updatedStock),
      },
    })
      .then((res) => {
        console.log("updated stock: ", res);
        setStockToEditByFlavor(undefined);
        setUpdatedStock("");
        refreshRow(false, productData.id || "");
      })
      .catch((e) => {
        console.error("Error updating stock: ", e);
      });
  }

  return (
    <div style={{ border: "1px solid yellow" }} className={classes.flavors}>
      {Array.isArray(flavors_inventory) &&
        flavors_inventory.map((item: FlavorsInventoryObj, i: number) => {
          return (
            <div
              style={{
                border: "1px solid red",
                padding: "12px",
              }}
              key={i}
            >
              <div>Flavor: {item.flavor}</div>
              {stockToEditByFlavor === item.flavor ? (
                <>
                  <input
                    type="text"
                    onChange={(e) => setUpdatedStock(e.target.value)}
                    defaultValue={flavors_inventory[i].inventory}
                  />
                  <button onClick={updateStock} style={{ color: "green" }}>
                    ✔️
                  </button>
                </>
              ) : (
                <>
                  <div onClick={() => setStockToEditByFlavor(item.flavor)}>
                    {" "}
                    Inventory: {flavors_inventory[i].inventory}
                  </div>
                </>
              )}
              <button
                onClick={() => deleteFlavor(item.flavor)}
                style={{ color: "red" }}
              >
                X
              </button>
            </div>
          );
        })}
      {/* OUTSIDE MAP NOW */}
      {showFlavorForm && (
        <>
          <FlavorsInventoryForm
            productId={productData.id}
            setFlavorsInvSalesPriceArr={setFlavorsInvSalesPriceArr}
          />
          <button onClick={addFlavorsInv}>Submit</button>
        </>
      )}
      <button onClick={() => setShowFlavorForm((prev) => !prev)}>
        {showFlavorForm ? "Cancel adding" : "Add Flavors"}
      </button>
    </div>
  );
}
