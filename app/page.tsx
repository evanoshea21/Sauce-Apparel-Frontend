import classes from "@/styles/HomePage.module.css";
import ProductGrid from "./components/ProductGrid";
import ProductSlider from "./components/ProductSlider";
import axios from "axios";
import { ProductData, Product } from "@/scripts/Types";
import { axiosCall } from "./utils";

export const revalidate = 60;

export default async function Home() {
  // get ALL products, show them below

  const response = await axiosCall({
    url: `${process.env.NEXT_PUBLIC_SDK_SERVER_BASE_URL}/products`,
    method: "POST",
    data: {
      method: "read",
    },
  });
  const response2 = await axiosCall({
    url: `${process.env.NEXT_PUBLIC_SDK_SERVER_BASE_URL}/products`,
    method: "POST",
    data: {
      method: "read",
      isFeatured: true,
    },
  });

  const products: Product[] | ProductData[] = response;
  const products2: Product[] | ProductData[] = response2;

  // console.log("Producst at /: =======\n", products);

  if (!products) return <></>;

  return (
    <>
      {/* <Navbar /> */}
      <div className={classes.main}>
        <ProductSlider title="Featured" products={products2} />
        <h1 style={{ textAlign: "center" }}>Shop All</h1>
        <ProductGrid products={products} />
      </div>
    </>
  );
}
