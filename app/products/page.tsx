import classes from "@/styles/Products.module.css";
import axios from "axios";
import type { Product, ProductData } from "../../scripts/Types";
import Link from "next/link";

export default async function ProductsPage() {
  // get products
  const response = await axios({
    url: "http://localhost:3000/api/products",
    method: "POST",
    data: {
      method: "read",
    },
  });
  const products: ProductData[] = response.data;

  return (
    <div className={classes.main}>
      <h1>Products Page</h1>
      {products.map((product: ProductData) => {
        return (
          <div className={classes.productCard}>
            <h3>{product.name}</h3>
            <div className={classes.imgBox}>
              <Link href={`/products/${product.name.split(" ").join("-")}`}>
                <img src={product.imageUrl} alt="image" />
              </Link>
            </div>
            <p>{product.category}</p>
            <p>{product.unitPrice}</p>
          </div>
        );
      })}
    </div>
  );
}
