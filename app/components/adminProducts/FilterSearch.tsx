import React from "react";
import classes from "@/styles/FilterSearch.module.css";
import type { Categories, Product } from "@/scripts/Types";
import FormGroup from "@mui/material/FormGroup";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import OutlinedInput from "@mui/material/OutlinedInput";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { flavorsHasLowInventory } from "@/app/utils";

const categoryNames: Categories[] = [
  "Disposable",
  "Non-Disposable",
  "Vape",
  "Other Vapes",
];
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface Props {
  allProducts: Product[];
  setProductsShown: React.Dispatch<React.SetStateAction<Product[]>>;
}

export default function FilterSearch({ allProducts, setProductsShown }: Props) {
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [featured, setFeatured] = React.useState<boolean>(false);
  const [onSale, setOnSale] = React.useState<boolean>(false);
  const [lowInv, setLowInv] = React.useState<boolean>(false);
  const [categories, setCategories] = React.useState<string[]>([]);

  React.useEffect(() => {
    filterProducts();
  }, [categories, featured, onSale, lowInv, searchTerm]);

  function filterProducts() {
    const filteredProductsArr: Product[] = [];

    for (let i = 0; i < allProducts.length; i++) {
      let product = allProducts[i];
      let searchTermUpper = searchTerm.toUpperCase();
      let productNameUpper = product.product.name.toUpperCase();

      if (
        searchTerm.length &&
        productNameUpper.indexOf(searchTermUpper) === -1
      ) {
        continue;
      }

      if (featured && product.product.isFeatured === false) {
        continue;
      }
      if (onSale && !product.product.salesPrice) {
        continue;
      }
      if (lowInv && !flavorsHasLowInventory(product.flavors_inventory, 8)) {
        continue;
      }
      if (categories.length && product.product.category) {
        if (!categories.includes(product.product.category)) {
          continue;
        }
      }

      filteredProductsArr.push(product);
    }
    setProductsShown(filteredProductsArr);
  }

  function resetFilters() {
    setSearchTerm("");
    setFeatured(false);
    setOnSale(false);
    setLowInv(false);
    setCategories([]);
  }

  const handleMultiSelect = (event: SelectChangeEvent<typeof categories>) => {
    const {
      target: { value },
    } = event;
    setCategories(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  function handleFeatured(e: any) {
    setFeatured(e.target.checked);
  }
  function handleOnSale(e: any) {
    setOnSale(e.target.checked);
  }
  function handleLowInv(e: any) {
    setLowInv(e.target.checked);
  }
  function handleSearchBar(e: any) {
    setSearchTerm(e.target.value);
  }

  return (
    <div className={classes.main}>
      <div className={classes.filters}>
        <input
          className={classes.searchBar}
          value={searchTerm ?? ""}
          type="text"
          placeholder="Search by Name"
          onChange={handleSearchBar}
        />
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox checked={featured ?? false} onChange={handleFeatured} />
            }
            label="Is Featured"
          />
          <FormControlLabel
            control={
              <Checkbox checked={onSale ?? false} onChange={handleOnSale} />
            }
            label="On Sale"
          />
          <FormControlLabel
            control={
              <Checkbox checked={lowInv ?? false} onChange={handleLowInv} />
            }
            label="Low Inventory"
          />
        </FormGroup>

        {/* <FormControl sx={{ m: 1, p: 4, width: 300 }}> */}
        <div>
          <InputLabel id="demo-multiple-chip-label">
            Categories to filter
          </InputLabel>
          <Select
            labelId="demo-multiple-chip-label"
            id="demo-multiple-chip"
            multiple
            value={categories}
            onChange={handleMultiSelect}
            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {categoryNames.map((category: Categories, i: number) => (
              <MenuItem
                key={category ?? "cat-" + i}
                value={category ?? "catValue-" + i}
                // style={getStyles(name, personName, theme)}
              >
                {category}
              </MenuItem>
            ))}
          </Select>
        </div>

        {/* </FormControl> */}
      </div>
      <Button onClick={resetFilters} variant="contained">
        Reset Filters
      </Button>
    </div>
  );
}
