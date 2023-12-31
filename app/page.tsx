import classes from "@/styles/HomePage.module.css";
import ProductGrid from "./components/ProductGrid";
import ProductSlider from "./components/ProductSlider";
import { ProductData, Product } from "@/scripts/Types";
import { axiosCall } from "./utils";

export const revalidate = 20;

export default async function Home() {
  // get ALL products, show them below

  const response = await axiosCall({
    url: `${process.env.NEXT_PUBLIC_SDK_SERVER_BASE_URL}/products`,
    method: "POST",
    data: {
      method: "read",
    },
  });
  const featuredResponse = await axiosCall({
    url: `${process.env.NEXT_PUBLIC_SDK_SERVER_BASE_URL}/products`,
    method: "POST",
    data: {
      method: "read",
      isFeatured: true,
    },
  });

  const products: Product[] | ProductData[] = response;
  const products2: Product[] | ProductData[] = featuredResponse;

  // console.log("Producst at /: =======\n", products);

  if (!products) return <></>;

  return (
    <>
      {/* <Navbar /> */}
      <div className={classes.main}>
        <ProductSlider title="Featured" products={products2} shuffle={true} />
        <h1 style={{ textAlign: "center", marginTop: "70px" }}>Shop All</h1>
        <ProductGrid products={products} />
      </div>
    </>
  );
}
