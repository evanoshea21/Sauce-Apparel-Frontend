import classes from "@/styles/HomePage.module.css";
import ProductGrid from "./components/ProductGrid";
import ProductSlider from "./components/ProductSlider";
import axios from "axios";
import { ProductData, Product } from "@/scripts/Types";

export const revalidate = 1800;

export default async function Home() {
  // get ALL products, show them below
  let response;
  try {
    response = await axios({
      url: "http://localhost:3000/api/products",
      method: "POST",
      data: {
        method: "read",
      },
    });
  } catch (e) {
    console.error("Error fetching products: ", e);
  }
  const products: Product[] | ProductData[] = response?.data;

  return (
    <>
      {/* <Navbar /> */}
      <div className={classes.main}>
        <ProductGrid products={products} />
        {/* <ProductSlider products={products}/> */}
      </div>
    </>
  );
}
