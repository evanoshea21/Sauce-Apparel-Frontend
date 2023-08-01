"use client";
import React from "react";
import type { FlavorsInventoryObj } from "@/scripts/Types";

interface ProductFormProps {
  defaultValues?: {
    name: string;
    unitPrice: string;
    imageUrl: string;

    description: string | null;
    inventory: number | null; //if no flavors
    salesPrice: string | null; // if no flavors
    category: string | null;
    isFeatured?: boolean;
  };
  setName: React.Dispatch<React.SetStateAction<string>>;
  setUnitPrice: React.Dispatch<React.SetStateAction<string>>;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;

  setDescription: React.Dispatch<React.SetStateAction<string | null>>;
  setInventory: React.Dispatch<React.SetStateAction<number | null>>;
  setSalesPrice: React.Dispatch<React.SetStateAction<string | null>>;
  setCategory: React.Dispatch<React.SetStateAction<string | null>>;
  setIsFeatured: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FlavorsInventoryProps {
  setFlavorsInvSalesPriceArr: React.Dispatch<
    React.SetStateAction<FlavorsInventoryObj[]>
  >;
}

export function ProductForm(props: ProductFormProps) {
  return (
    <div>
      <form>
        <div>
          <input
            required
            id="adminProductCreate_name"
            placeholder="name"
            name="name"
            type="text"
            onChange={(e) => props.setName(e.target.value)}
          />
          <label htmlFor="adminProductCreate_name">Name</label>
        </div>

        <div>
          <input
            required
            id="adminProductCreate_unitPrice"
            placeholder="unitPrice"
            name="unitPrice"
            type="text"
            onChange={(e) => props.setUnitPrice(e.target.value)}
          />
          <label htmlFor="adminProductCreate_unitPrice">UnitPrice</label>
        </div>

        <div>
          <input
            required
            id="adminProductCreate_stock"
            placeholder="stock"
            name="stock"
            type="text"
            onChange={(e) => props.setInventory(Number(e.target.value))}
          />
          <label htmlFor="adminProductCreate_stock">Stock</label>
        </div>

        <div>
          <input
            required
            id="adminProductCreate_imageUrl"
            placeholder="imageUrl"
            name="imageUrl"
            type="text"
            onChange={(e) => props.setImageUrl(e.target.value)}
          />
          <label htmlFor="adminProductCreate_imageUrl">ImageUrl</label>
        </div>

        <div>
          <input
            id="adminProductCreate_description"
            placeholder="description"
            name="description"
            type="text"
            onChange={(e) => props.setDescription(e.target.value)}
          />
          <label htmlFor="adminProductCreate_description">Desccription?</label>
        </div>

        <div>
          <input
            id="adminProductCreate_salesPrice"
            placeholder="salesPrice"
            name="salesPrice"
            type="text"
            onChange={(e) => props.setSalesPrice(e.target.value)}
          />
          <label htmlFor="adminProductCreate_salesPrice">Sales Price?</label>
        </div>

        <div>
          <input
            id="adminProductCreate_category"
            placeholder="category"
            name="category"
            type="text"
            onChange={(e) => props.setCategory(e.target.value)}
          />
          <label htmlFor="adminProductCreate_category">Category?</label>
        </div>

        <div>
          <input
            id="adminProductCreate_isFeatured"
            placeholder="isFeatured"
            name="isFeatured"
            type="number"
            onChange={(e) => props.setIsFeatured(!!Number(e.target.value))}
          />
          <label htmlFor="adminProductCreate_isFeatured">Is Featured?</label>
        </div>
      </form>
    </div>
  );
}
export function FlavorsInventoryForm(props: FlavorsInventoryProps) {
  const [rowsCount, setRowsCount] = React.useState(4);

  function handleChange(rowIndex: number) {
    // get the i-th input with name flavor/inventory/salesPrice
    let flavorElem: any = document.querySelector(`#flavor-${rowIndex}`);
    let inventoryElem: any = document.querySelector(`#inventory-${rowIndex}`);
    let salesPriceElem: any = document.querySelector(`#salesPrice-${rowIndex}`);

    let obj = {
      flavor: flavorElem.value,
      inventory: Number(inventoryElem.value),
      salesPrice:
        salesPriceElem.value.length === 0 ? null : salesPriceElem.value,
      productId: "",
    };

    props.setFlavorsInvSalesPriceArr((prev) => {
      let arr = [...prev];
      arr[rowIndex] = obj;
      return arr;
    });
  }
  return (
    <div
      style={{
        border: "3px solid green",
      }}
    >
      <form>
        <h3>Input Flavors & Inventories</h3>
        {Array.apply(null, Array(rowsCount)).map((_x, i: number) => {
          return (
            <div key={i}>
              <input
                id={`flavor-${i}`}
                type="text"
                name="flavor"
                placeholder={`flavor-${i}`}
                onChange={() => handleChange(i)}
              />
              <input
                id={`inventory-${i}`}
                type="text"
                name="inventory"
                placeholder={`inventory-${i}`}
                onChange={() => handleChange(i)}
              />
              <input
                id={`salesPrice-${i}`}
                type="text"
                name="salesPrice"
                placeholder={`salesPrice-${i}`}
                onChange={() => handleChange(i)}
              />
            </div>
          );
        })}
      </form>
      <button
        disabled={rowsCount >= 12}
        onClick={() => setRowsCount((prev) => prev + 4)}
      >
        Add more Flavors
      </button>
    </div>
  );
}

/*

in order to SET the array, onChange should call a function, that get's the current rows data, then inputs it into the INDEX of the setArray prop.


For flavors-inventories-salesprice
SHAPE:

[
  {
    flavor: 'apple'
    inventory: 24
    salesPrice: null
  },
  {
    flavor: 'peach'
    inventory: 94
    salesPrice: '14.89'
  },
  {
    flavor: 'orange'
    inventory: 47
    salesPrice: null
  },

]


*/
