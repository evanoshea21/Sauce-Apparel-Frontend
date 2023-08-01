"use client";
import React from "react";
import type { Product, ProductData } from "@/scripts/Types";
import axios from "axios";
import classes from "@/styles/Admin.module.css";
import {
  FlavorsInventoryForm,
  ProductForm,
} from "../forms/ProductFlavorsForms";
import type { FlavorsInventoryObj } from "@/scripts/Types";

//Product (everything) vs ProductData (only the product's data)

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
  const [name, setName] = React.useState<string>(product.product.name);
  const [unitPrice, setUnitPrice] = React.useState<string>(
    product.product.unitPrice
  );
  const [imageUrl, setImageUrl] = React.useState<string>(
    product.product.imageUrl
  );
  const [inventory, setInventory] = React.useState<number | null>(
    product.product.inventory
  );
  const [description, setDescription] = React.useState<string | null>(
    product.product.description
  );
  const [salesPrice, setSalesPrice] = React.useState<string | null>(
    product.product.salesPrice
  );
  const [category, setCategory] = React.useState<string | null>(
    product.product.category
  );
  const [isFeatured, setIsFeatured] = React.useState<boolean>(
    product.product.isFeatured || false
  );

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

  function updateProduct() {
    const payload: ProductData = {
      name,
      unitPrice,
      imageUrl,
      inventory,
      description,
      salesPrice,
      category,
      isFeatured,
    };

    axios({
      url: "api/products",
      method: "POST",
      data: {
        method: "update",
        productId: product.product.id || "",
        data: payload,
      },
    })
      .then((res) => {
        console.log("Updated Product");
        console.log(res.data);
        // SPLICE row
        refreshRow(false, product.product.id || "");
      })
      .catch((err) => {
        console.error(err);
      });
    setIsEditMode(false);
  }

  if (!product) return <></>;

  if (isEditMode) {
    return (
      <div
        style={{
          border: "1px solid green",
          padding: "20px",
        }}
      >
        <ProductForm
          defaultValues={{
            name: product.product.name,
            unitPrice: product.product.unitPrice,
            imageUrl: product.product.imageUrl,

            description: product.product.description,
            inventory: product.product.inventory, //if no flavors
            salesPrice: product.product.salesPrice, // if no flavors
            category: product.product.category,
            isFeatured: product.product.isFeatured,
          }}
          setName={setName}
          setUnitPrice={setUnitPrice}
          setImageUrl={setImageUrl}
          setInventory={setInventory}
          setDescription={setDescription}
          setSalesPrice={setSalesPrice}
          setCategory={setCategory}
          setIsFeatured={setIsFeatured}
        />
        <button onClick={updateProduct}>UPDATE PRODUCT</button>
      </div>
    );
  }

  return (
    <div
      style={{
        border: "1px solid green",
        padding: "20px",
        margin: "3px",
      }}
    >
      <h2>Product name: "{product.product.name}"</h2>
      <p>Unit Price: ${product.product.unitPrice}</p>
      <div>
        <img
          src={product.product.imageUrl}
          width="60"
          height="60"
          alt="image"
        />
      </div>
      <p>Description: {product.product.description || "none"}</p>
      {product.flavors_inventory.length === 0 && (
        <p>Inventory: {product.product.inventory}</p>
      )}
      <p style={{ color: "red" }}>
        Sale
        {product.product.salesPrice
          ? ` Price: $${product.product.salesPrice}`
          : ": none"}
      </p>
      <p>Category: {product.product.category || "uncategorized"}</p>
      <p>Is Featured: {product.product.isFeatured ? "Yes" : "Nope"}</p>
      <button onClick={() => setIsEditMode((prev) => !prev)}>
        EDIT PRODUCT
      </button>
      <h3>Flavors:</h3>
      <FlavorsCrud
        refreshRow={refreshRow}
        productData={product.product}
        flavors_inventory={product.flavors_inventory}
      />

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
        const elems: NodeListOf<HTMLInputElement> = document.querySelectorAll(
          ".flavorInventoryInput"
        );
        elems.forEach((elem) => (elem.value = ""));

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
              <p>SKU: {item.sku}</p>
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
