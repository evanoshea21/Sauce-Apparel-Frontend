import Image from "next/image";
import classes from "@/styles/HomePage.module.css";
import Navbar from "./components/Navbar";
import ProductGrid from "./components/ProductGrid";
import ProductSlider from "./components/ProductSlider";

export default function Home() {
  return (
    <>
      {/* <Navbar /> */}
      <div className={classes.main}>
        <ProductGrid />
        {/* <ProductSlider /> */}
      </div>
    </>
  );
}
