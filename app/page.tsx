import classes from "@/styles/HomePage.module.css";
import ProductGrid from "./components/ProductGrid";
import ProductSlider from "./components/ProductSlider";
import axios from "axios";
import { ProductData, Product } from "@/scripts/Types";
import { axiosCall } from "./utils";

export const revalidate = 12;

export default async function Home() {
  // get ALL products, show them below

  const response = await axiosCall({
    url: `http://localhost:3000/api/products`,
    method: "POST",
    data: {
      method: "read",
    },
  });

  const products: Product[] | ProductData[] = response;

  // console.log("Producst at /: =======\n", products);

  if (!products) return <></>;

  return (
    <>
      {/* <Navbar /> */}
      <div className={classes.main}>
        <ProductGrid products={products} />
        <ProductSlider products={products} />
      </div>
    </>
  );
}
