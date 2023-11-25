import { ProductData, Product } from "@/scripts/Types";
import classes from "@/styles/ProductDisplay.module.css";
import axios from "axios";
import ProductCard from "./ProductCard";

interface Props {
  products: Product[] | ProductData[];
}

export default async function ProductDisplay({ products }: Props) {
  return (
    <div className={classes.gridMain}>
      {/* <h1>Candy For You</h1> */}
      <div className={classes.gridDisplay}>
        {products.map((product) => {
          return <ProductCard product={product} />;
        })}
      </div>
    </div>
  );
}
