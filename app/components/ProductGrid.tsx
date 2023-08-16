import { ProductData } from "@/scripts/Types";
import classes from "@/styles/ProductDisplay.module.css";
import axios from "axios";
import ProductCard from "./ProductCard";

export default async function ProductDisplay() {
  const productsRes = await axios({
    url: "http://localhost:3000/api/products",
    method: "POST",
    data: {
      method: "read",
      excludeOutOfStock: true,
    },
  });
  const products: ProductData[] = productsRes.data;

  return (
    <div className={classes.gridMain}>
      <h1>Vapes For You</h1>
      <div className={classes.gridDisplay}>
        {products.map((product) => {
          return <ProductCard product={product} />;
        })}
      </div>
    </div>
  );
}
