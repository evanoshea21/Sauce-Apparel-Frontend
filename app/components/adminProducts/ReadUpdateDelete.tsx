"use client";
import React from "react";
import type { Product, ProductData } from "@/scripts/Types";
import axios from "axios";
import classes from "@/styles/AdminProducts.module.css";
import {
  FlavorsInventoryForm,
  ProductForm,
} from "../forms/ProductFlavorsForms";
import type { FlavorsInventoryObj } from "@/scripts/Types";
import Button from "@mui/material/Button";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
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
      <div style={{ height: "600px" }}></div>
    </div>
  );
}

interface ProductRowProps {
  product: Product;
  refreshRow: (isDelete: boolean, productId: string) => Promise<void>;
}

function ProductRow({ product, refreshRow }: ProductRowProps) {
  const [display, setDisplay] = React.useState<
    "product" | "edit product" | "configure flavors"
  >("product");
  const [rowHeight, setRowHeight] = React.useState<string>("");
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

  const [categoryColor, setCategoryColor] = React.useState("grey");

  // set category color
  React.useEffect(() => {
    let category = product.product.category;
    if (category === "Uncategorized") {
      setCategoryColor("grey");
    } else if (category === "Disposable") {
      setCategoryColor("grey");
    } else if (category === "60ml") {
      setCategoryColor("grey");
    } else if (category === "120ml") {
      setCategoryColor("grey");
    } else {
      setCategoryColor("grey");
    }
  }, [product]);

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
    setDisplay("product");
  }

  function setHeight(id: string, initial?: boolean) {
    let flavorCRUD: HTMLElement | null = document.querySelector(
      `.flavorsCRUD-${id}`
    );
    let productRow: HTMLElement | null = document.querySelector(`.productRow`);
    if (initial && productRow) {
      setRowHeight(`${productRow.offsetHeight}px`);
    } else {
      if (flavorCRUD && productRow) {
        console.log("Flavors(pid) Height: \n", flavorCRUD.offsetHeight);
        console.log("ProductRow Height: \n", productRow.offsetHeight);
        setRowHeight(`${flavorCRUD.offsetHeight + productRow.offsetHeight}px`);
      } else {
        console.log("oops, couldnt find elements for height");
      }
    }
  }

  // React.useEffect(() => {
  //   setHeight(product.product.id ?? "", true);
  // }, []);

  if (!product) return <></>;

  return (
    <div>
      <div
        className={`${classes.main} productRow-${product.product.id}`}
        style={
          {
            // height: rowHeight,
            // transition: "all 2s ease",
            // overflow: "hidden",
          }
        }
      >
        {/* PIC */}
        <div className={classes.picLeft}>
          <div className={classes.imgBox}>
            <img src={product.product.imageUrl} alt="product-image" />
          </div>
        </div>

        {/* INFO */}
        <div className={classes.info}>
          <p className={classes.id}>id: {product.product.id}</p>
          <div className={classes.title}>
            <h2>{product.product.name}</h2>
            <EditTwoToneIcon
              sx={{ fontSize: "2rem" }}
              className={classes.editIcon}
              onClick={() => {
                setDisplay(
                  display === "edit product" ? "product" : "edit product"
                );
                // setHeight(product.product.id ?? "");
              }}
            />
          </div>
          <div className={classes.tags}>
            <div
              style={{ backgroundColor: categoryColor }}
              className={classes.category}
            >
              {product.product.category}
            </div>
            {product.product.isFeatured && (
              <div className={classes.featured}>Featured</div>
            )}
          </div>
        </div>

        {/* CONFIG */}
        <div className={classes.config}>
          <Button
            variant="outlined"
            onClick={() =>
              setDisplay(
                display === "configure flavors"
                  ? "product"
                  : "configure flavors"
              )
            }
          >
            Configure Flavors
          </Button>
        </div>

        {/* PRICE */}
        <div className={classes.price}>
          <h3>
            $ {product.product.unitPrice}
            {product.product.unitPrice.length === 2 ? ".00" : ""}
          </h3>
          {product.product.salesPrice && (
            <div className={classes.salesPrice}>
              $ {product.product.salesPrice}{" "}
              {product.product.salesPrice.length === 2 ? ".00" : ""}
            </div>
          )}
        </div>
      </div>

      {/* SHOW EDIT PRODUCT */}
      {display === "edit product" && (
        <div style={{ margin: "0px 0 40px 0" }}>
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
          <Button
            variant="contained"
            onClick={updateProduct}
            className={classes.btn}
          >
            UPDATE PRODUCT
          </Button>
          <Button
            variant="outlined"
            onClick={deleteEntireProduct}
            className={classes.btnDelete}
          >
            Delete ENTIRE PRODUCT
          </Button>
        </div>
      )}
      {/* SHOW CONFIG FLAVORS */}
      {display === "configure flavors" && (
        <div className={`flavorsCRUD-${product.product.id}`}>
          <FlavorsCrud
            refreshRow={refreshRow}
            productData={product.product}
            flavors_inventory={product.flavors_inventory}
          />
        </div>
      )}
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
  const [flavorUpdates, setFlavorUpdates] = React.useState<{
    [key: string]: number;
  }>({});
  const [stockResponse, setStockResponse] = React.useState<string>("");
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
    axios({
      url: "api/flavor",
      method: "POST",
      data: {
        method: "update_inventory",
        productId: productData.id,
        flavorUpdates,
      },
    })
      .then((res) => {
        console.log("updated stock: ", res);
        setFlavorUpdates({});
        refreshRow(false, productData.id || "");
        setStockResponse("Successfully Updated!");
      })
      .catch((e) => {
        console.error("Error updating stock: ", e);
      });
  }

  return (
    <div className={classes.flavors}>
      <div className={classes.flavorRows}>
        <h3 className={classes.headerFlavor}>Flavor</h3>
        <h3 className={classes.headerInv}>Inventory</h3>
        {Array.isArray(flavors_inventory) &&
          flavors_inventory.map((item: FlavorsInventoryObj, i: number) => {
            return (
              <div className={classes.flavorRow} key={item.sku ?? i}>
                <div className={classes.flavorName}>{item.flavor}</div>
                <input
                  className={classes.inventoryInput}
                  type="number"
                  min="0"
                  defaultValue={item.inventory}
                  onChange={(e) =>
                    setFlavorUpdates((prev) => {
                      prev[item.flavor] = Number(e.target.value);
                      return prev;
                    })
                  }
                />
                <Button
                  className={classes.flavorDelete}
                  variant="contained"
                  onClick={() => deleteFlavor(item.flavor)}
                >
                  X
                </Button>
              </div>
            );
          })}
        {/* OUTSIDE MAP NOW */}
        <Button variant="contained" onClick={() => updateStock()}>
          Update Stock
        </Button>
      </div>
      {stockResponse.length !== 0 && (
        <span style={{ color: "green" }}>{stockResponse}</span>
      )}
      <div className={classes.addFlavorForm}>
        <FlavorsInventoryForm
          productId={productData.id}
          setFlavorsInvSalesPriceArr={setFlavorsInvSalesPriceArr}
        />
        <Button
          className={classes.addFlavorBtn}
          variant="contained"
          onClick={addFlavorsInv}
        >
          Add Flavors
        </Button>
      </div>
    </div>
  );
}
