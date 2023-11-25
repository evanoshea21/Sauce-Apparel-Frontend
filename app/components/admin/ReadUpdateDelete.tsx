"use client";
import React from "react";
import type { Product, ProductData } from "@/scripts/Types";
import axios from "axios";
import {
  isValidPrice,
  isPositiveInteger,
  sizesHasLowInventory,
  roundPrice,
} from "@/app/utils";
import classes from "@/styles/AdminProducts.module.css";
import { SizesInventoryForm, ProductForm } from "../forms/ProductSizesForms";
import StarIcon from "@mui/icons-material/Star";
import type { SizesInventoryObj } from "@/scripts/Types";
import Button from "@mui/material/Button";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import FilterSearch from "./FilterSearch";
import Create from "./Create";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
//Product (everything) vs ProductData (only the product's data)
import AddIcon from "@mui/icons-material/Add";
import ProductCard, { determineColor } from "@/app/components/ProductCard";

export default function Read() {
  const [update, setUpdate] = React.useState<boolean>(false);
  const [allProducts, setAllProducts] = React.useState<Product[]>([]);
  const [productsShown, setProductsShown] = React.useState<Product[]>([]);
  const [display, setDisplay] = React.useState<"read" | "add">("read");
  const [refreshList, setRefreshList] = React.useState<boolean>(false);

  // get ALL products
  React.useEffect(() => {
    setProductsShown([]);
    setAllProducts([]);
    (async function () {
      let productResponse = await axios({
        url: "/api/products",
        method: "POST",
        data: { method: "read", fullProduct: true },
      });
      setProductsShown(productResponse.data);
      setAllProducts(productResponse.data);
    })();
  }, [update, refreshList]);

  async function refreshRow(isDelete: boolean, productId: string) {
    // if deleting, find where product id
    if (isDelete) {
      setProductsShown((prevProductArr) => {
        let arr = prevProductArr.slice().filter((product) => {
          return product.id !== productId;
        });
        return arr;
      });
      setAllProducts((prevProductArr) => {
        let arr = prevProductArr.slice().filter((product) => {
          return product.id !== productId;
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
        fullProduct: true,
        id: productId,
      },
    });
    console.log("response REFRESH: ", response.data);

    let foundIndexGlobal: number;

    setProductsShown((prevProductArr) => {
      let arr = prevProductArr.slice();
      // find index where name = name
      let foundIndex: number = 0;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === productId) {
          foundIndex = i;
          foundIndexGlobal = i;
          break;
        }
      }
      // replace index with response.data
      arr[foundIndex] = response.data[0];
      return arr;
    });
    setAllProducts((prevProductArr) => {
      let arr = prevProductArr.slice();
      // replace index with response.data
      arr[foundIndexGlobal] = response.data[0];
      return arr;
    });
  }

  if (display === "add") {
    return <Create setDisplay={setDisplay} setRefreshList={setRefreshList} />;
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "800px",
          margin: "70px auto 50px auto",
          padding: "0 10px",
        }}
      >
        <h1 style={{ marginLeft: "10px", margin: "0px", textAlign: "center" }}>
          Products & Inventory
        </h1>
        <div
          onClick={() => setDisplay("add")}
          style={{
            fontSize: "1.1rem",
            padding: "10px 20px",
            backgroundColor: "rgb(55, 64, 57)",
            color: "white",
            cursor: "pointer",
            textAlign: "center",
            borderRadius: "4px",

            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <AddIcon />
          Add Product
        </div>
      </div>
      <FilterSearch
        allProducts={allProducts}
        setProductsShown={setProductsShown}
        setUpdate={setUpdate}
      />

      {productsShown.map((item, i) => (
        <ProductRow refreshRow={refreshRow} product={item} key={item.id ?? i} />
      ))}
      <div style={{ height: "600px" }}></div>
    </div>
  );
}

//

//

//

//

interface ProductRowProps {
  product: Product;
  refreshRow: (isDelete: boolean, productId: string) => Promise<void>;
}

function ProductRow({ product, refreshRow }: ProductRowProps) {
  const [display, setDisplay] = React.useState<
    "product" | "edit product" | "configure sizes"
  >("product");
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>();
  const [successMessage, setSuccessMessage] = React.useState<
    string | undefined
  >();
  const [name, setName] = React.useState<string>(product.name);
  const [unitPrice, setUnitPrice] = React.useState<string>(product.unitPrice);
  const [imageUrl, setImageUrl] = React.useState<string>(product.imageUrl);
  const [description, setDescription] = React.useState<string | null>(
    product.description
  );
  const [salesPrice, setSalesPrice] = React.useState<string | null>(
    product.salesPrice
  );
  const [category, setCategory] = React.useState<string | null>(
    product.category
  );
  const [isFeatured, setIsFeatured] = React.useState<boolean>(
    product.isFeatured || false
  );

  const [categoryColor, setCategoryColor] = React.useState("grey");
  const [isLoadingAjax, setIsLoadingAjax] = React.useState(false);

  function timeoutSuccess() {
    setTimeout(() => {
      setSuccessMessage(undefined);
    }, 3000);
  }

  // [TODO] -- set category tags color
  React.useEffect(() => {
    let category: string | null = product.category;
    setCategoryColor(determineColor(product.category ?? ""));
  }, [product]);

  function deleteEntireProduct() {
    if (isLoadingAjax) return;
    setIsLoadingAjax(true);
    axios({
      url: "api/products",
      method: "DELETE",
      data: { id: product.id },
    })
      .then((res) => {
        console.log("IT WORKED! deleted");
        console.log(res.data);
        // SPLICE row
        setDisplay("product");
        setIsLoadingAjax(false);
        refreshRow(true, product.id || "");
      })
      .catch((err) => {
        setIsLoadingAjax(false);
        console.error(err);
      });
  }

  function updateProduct() {
    if (isLoadingAjax) return;
    setIsLoadingAjax(true);
    // Form Error Checks
    if (!name.length || !unitPrice.length || !imageUrl.length) {
      //handle error message UI for required fields
      setErrorMessage(
        "'Name', 'Unit Price', and 'Image URL' are required fields"
      );
      setIsLoadingAjax(false);
      return;
    }
    if (!isValidPrice(unitPrice)) {
      setErrorMessage("Not a valid Unit Price. Max 2 decimal places.");
      setIsLoadingAjax(false);
      return;
    }
    if (salesPrice && !isValidPrice(salesPrice)) {
      setErrorMessage("Not a valid Sales Price. Max 2 decimal places.");
      setIsLoadingAjax(false);
      return;
    }

    const payload: ProductData = {
      name,
      unitPrice,
      imageUrl,
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
        productId: product.id || "",
        data: payload,
      },
    })
      .then((res) => {
        console.log("Updated Product");
        console.log(res.data);
        // SPLICE row
        refreshRow(false, product.id || "");
        // setDisplay("product");
        setErrorMessage(undefined);
        setIsLoadingAjax(false);
        setSuccessMessage("Successfully Updated!");
        timeoutSuccess();
      })
      .catch((err) => {
        setIsLoadingAjax(false);
        // account for DUPLICATE ROW
        if (err.response.data.error.meta.target === "Products_name_key") {
          setErrorMessage(
            "A product by this name already exists. Try another name."
          );
        } else {
          console.error(err.response.data.error.meta.target);
          setErrorMessage("There was an Error updating your product..");
        }
      });
  }

  if (!product) return <></>;

  return (
    <div>
      <div
        className={classes.main}
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
            <img src={product.imageUrl} alt="product-image" />
          </div>
        </div>

        {/* INFO */}
        <div className={classes.info}>
          <p className={classes.id}>id: {product.id}</p>
          <div className={classes.title}>
            <h2>{product.name}</h2>
          </div>
          <div className={classes.tags}>
            <div
              style={{ backgroundColor: categoryColor }}
              className={classes.category}
            >
              {product.category}
            </div>
            {product.isFeatured && (
              <div className={classes.featured}>
                <StarIcon sx={{ fontSize: 16 }} />
                <span>Featured</span>
              </div>
            )}
          </div>
        </div>

        {/* CONFIG */}
        <div className={classes.config}>
          <div className={classes.configBtns}>
            <EditTwoToneIcon
              sx={{
                fontSize: "2rem",
                backgroundColor:
                  display === "edit product" ? "rgb(216, 216, 216)" : "",
              }}
              className={classes.editIcon}
              onClick={() => {
                setDisplay(
                  display === "edit product" ? "product" : "edit product"
                );
              }}
            />
            <Button
              variant="outlined"
              onClick={() =>
                setDisplay(
                  display === "configure sizes" ? "product" : "configure sizes"
                )
              }
            >
              {display === "configure sizes" ? "Hide Sizes" : "Edit Sizes"}
            </Button>
          </div>
          {product.Sizes_Inventory &&
            sizesHasLowInventory(product.Sizes_Inventory, 8) && (
              <p className={classes.lowInvWarning}>Low Inventory Warning</p>
            )}
        </div>

        {/* PRICE */}
        <div className={classes.price}>
          <h3>$ {roundPrice(product.unitPrice)}</h3>
          {product.salesPrice && (
            <div className={classes.salesPrice}>
              $ {roundPrice(product.salesPrice)}
            </div>
          )}
        </div>
      </div>

      {/* SHOW EDIT PRODUCT */}
      {display === "edit product" && (
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <div style={{ margin: "0px 0 40px 0" }}>
            <ProductForm
              defaultValues={{
                name: product.name,
                unitPrice: product.unitPrice,
                imageUrl: product.imageUrl,

                description: product.description,
                salesPrice: product.salesPrice, // if no sizes
                category: product.category,
                isFeatured: product.isFeatured,
              }}
              setName={setName}
              setUnitPrice={setUnitPrice}
              setImageUrl={setImageUrl}
              setDescription={setDescription}
              setSalesPrice={setSalesPrice}
              setCategory={setCategory}
              setIsFeatured={setIsFeatured}
            />
            {errorMessage && (
              <p
                style={{ marginLeft: "30px", color: "red", maxWidth: "400px" }}
              >
                Error: {errorMessage}
              </p>
            )}
            {successMessage && (
              <p style={{ marginLeft: "30px", color: "rgb(55, 64, 57)" }}>
                Success: {successMessage}
              </p>
            )}
            <Button
              variant="contained"
              onClick={updateProduct}
              className={classes.btn}
              disabled={isLoadingAjax}
            >
              {isLoadingAjax ? "Sending.." : "UPDATE PRODUCT"}
            </Button>

            <Button
              variant="outlined"
              onClick={deleteEntireProduct}
              className={classes.btnDelete}
              disabled={isLoadingAjax}
            >
              {isLoadingAjax ? "Sending.." : "Delete ENTIRE Product"}
            </Button>
          </div>
          <div className={classes.sampleView}>
            <div style={{ textAlign: "center" }}>Sample View:</div>
            <div style={{ maxWidth: "300px" }}>
              <ProductCard
                product={{
                  name,
                  unitPrice,
                  description,
                  imageUrl,
                  salesPrice,
                  category,
                }}
                isSample={true}
              />
            </div>
          </div>
        </div>
      )}
      {/* SHOW CONFIG SIZES */}
      {display === "configure sizes" && (
        <div className={`sizesCRUD-${product.id}`}>
          <SizesCrud
            refreshRow={refreshRow}
            productData={product}
            sizes_inventory={product.Sizes_Inventory ?? []}
          />
        </div>
      )}
    </div>
  );
}

interface SizesProps {
  productData: ProductData;
  sizes_inventory: SizesInventoryObj[];
  refreshRow: (isDelete: boolean, productId: string) => Promise<void>;
}

function SizesCrud({ productData, sizes_inventory, refreshRow }: SizesProps) {
  const [errorMessage1, setErrorMessage1] = React.useState<
    string | undefined
  >();
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>();
  const [sizeUpdates, setSizeUpdates] = React.useState<{
    [key: string]: number;
  }>({});
  const [stockResponse, setStockResponse] = React.useState<
    string | undefined
  >();
  const [sizesInvArr, setSizesInvArr] = React.useState<SizesInventoryObj[]>([]);
  const [isLoadingAjax, setIsLoadingAjax] = React.useState(false);

  function addSizesInv() {
    if (isLoadingAjax) return;
    setIsLoadingAjax(true);
    // check for valid Size-Inventory Entries
    const validSizeArr: SizesInventoryObj[] = [];
    const duplicateSizes: { [key: string]: boolean } = {};
    for (let i = 0; i < sizesInvArr.length; i++) {
      let item = sizesInvArr[i];
      if (!item) continue;
      //if only 1..
      if ((item.size && !item.inventory) || (!item.size && item.inventory)) {
        setErrorMessage("Every size must have a corresponding inventory.");
        setIsLoadingAjax(false);
        return;
      }
      // if none, skip //
      if (!item.size && !item.inventory) continue;
      // if 2, but invalid inventory
      if (!isPositiveInteger(item.inventory)) {
        setErrorMessage("Invalid inventory found. Must be positive integer.");
        setIsLoadingAjax(false);
        return;
      }
      //if duplicate size
      if (duplicateSizes[item.size] !== undefined) {
        setErrorMessage("Duplicate Sizes found.");
        setIsLoadingAjax(false);
        return;
      } else {
        duplicateSizes[item.size] = true;
      }
      // else push
      validSizeArr.push(item);
    }

    console.log("Payload add SizesInv: \n", sizesInvArr);

    const payload = validSizeArr;
    payload.forEach((row) => {
      row.productId = productData.id || "";
    });

    //CREATE
    axios({
      url: "api/size",
      method: "POST",
      data: { method: "create", data: payload },
    })
      .then((res) => {
        const elems: NodeListOf<HTMLInputElement> = document.querySelectorAll(
          ".sizeInventoryInput"
        );
        elems.forEach((elem) => (elem.value = ""));

        console.log("added size: ", res);
        refreshRow(false, productData.id || "");
        setSizesInvArr([]);
        setIsLoadingAjax(false);
        setErrorMessage(undefined);
      })
      .catch((e) => {
        setIsLoadingAjax(false);
        if (
          e.response.data.error.meta.target ===
          "Sizes_Inventory_productId_size_key"
        ) {
          setErrorMessage(
            "A Size you're trying to add already exists. Try again."
          );
        } else {
          setErrorMessage("Error adding sizes..");
          console.error("Error adding size: ", e);
        }
      });
  }

  function deleteSize(size: string) {
    if (isLoadingAjax) return;
    setIsLoadingAjax(true);
    // use product.NAME and SIZE to delete row
    axios({
      url: "api/size",
      method: "DELETE",
      data: { productId: productData.id, size },
    })
      .then((res) => {
        console.log("deleted size: ", res.data);
        refreshRow(false, productData.id || "");
        setIsLoadingAjax(false);
      })
      .catch((e) => {
        console.error("Error deleting size: ", e);
        setIsLoadingAjax(false);
      });
  }

  function updateStock() {
    if (isLoadingAjax) return;
    setIsLoadingAjax(true);

    let validInventory = true;
    Object.values(sizeUpdates).forEach((inventory) => {
      if (!isPositiveInteger(inventory)) {
        validInventory = false;
      }
    });
    if (!validInventory) {
      setErrorMessage1("Invalid Inventory. Must be positive integers.");
      setIsLoadingAjax(false);
      return;
    }

    axios({
      url: "api/size",
      method: "POST",
      data: {
        method: "update_inventory",
        productId: productData.id,
        sizeUpdates,
      },
    })
      .then((res) => {
        console.log("updated stock: ", res);
        setSizeUpdates({});
        setErrorMessage1(undefined);
        refreshRow(false, productData.id || "");
        setStockResponse("Successfully Updated!");
        setIsLoadingAjax(false);
        setTimeout(() => {
          setStockResponse(undefined);
        }, 3000);
      })
      .catch((e) => {
        console.error("Error updating stock: ", e);
        setIsLoadingAjax(false);
      });
  }

  return (
    <div className={classes.sizes}>
      {sizes_inventory.length !== 0 && (
        <div className={classes.sizeRows}>
          <h3 className={classes.headerSize}>Size</h3>
          <h3 className={classes.headerInv}>Inventory</h3>
          {Array.isArray(sizes_inventory) &&
            sizes_inventory.map((item: SizesInventoryObj, i: number) => {
              return (
                <div className={classes.sizeRow} key={item.sku ?? i}>
                  <div
                    style={{
                      color: item.inventory < 8 ? "orange" : "",
                    }}
                    className={classes.sizeName}
                  >
                    {item.size}
                    <Tooltip title={`SKU: ${item.sku}`}>
                      <HelpOutlineIcon sx={{ ml: 1, fontSize: 16 }} />
                    </Tooltip>
                  </div>
                  <input
                    className={classes.inventoryInput}
                    type="number"
                    min="0"
                    defaultValue={item.inventory ?? ""}
                    onChange={(e) =>
                      setSizeUpdates((prev) => {
                        prev[item.size] = Number(e.target.value);
                        return prev;
                      })
                    }
                  />
                  <Button
                    className={classes.sizeDelete}
                    variant="contained"
                    onClick={() => deleteSize(item.size)}
                    disabled={isLoadingAjax}
                  >
                    X
                  </Button>
                </div>
              );
            })}
          {/* OUTSIDE MAP NOW */}
          {errorMessage1 && (
            <p style={{ color: "red", maxWidth: "400px" }}>{errorMessage1}</p>
          )}
          {stockResponse && (
            <p style={{ color: "rgb(55, 64, 57)", maxWidth: "400px" }}>
              {stockResponse}
            </p>
          )}
          <Button
            variant="contained"
            onClick={() => updateStock()}
            disabled={isLoadingAjax}
          >
            {isLoadingAjax ? "Sending.." : "Update Stock"}
          </Button>
        </div>
      )}

      <div
        style={{
          position: "sticky",
          top: "20px",
        }}
        className={classes.addSizeForm}
      >
        <SizesInventoryForm
          productId={productData.id}
          setSizesInvArr={setSizesInvArr}
        />
        {errorMessage && (
          <p style={{ marginLeft: "30px", color: "red", maxWidth: "400px" }}>
            Error: {errorMessage}
          </p>
        )}
        <Button
          className={classes.addSizeBtn}
          variant="contained"
          onClick={addSizesInv}
          disabled={isLoadingAjax}
        >
          {isLoadingAjax ? "Sending.." : "Add Sizes"}
        </Button>
      </div>
    </div>
  );
}
