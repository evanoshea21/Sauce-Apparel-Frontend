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
    },
  });
  const products: ProductData[] = productsRes.data;

  return (
    <div>
      <h1>Vapes For You!</h1>
      <div className={classes.display}>
        {products.map((product) => {
          return <ProductCard product={product} />;
        })}
      </div>
    </div>
  );
}
