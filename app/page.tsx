import Image from "next/image";
import classes from "@/styles/HomePage.module.css";
import Navbar from "./components/Navbar";
import ProductDisplay from "./components/ProductDisplay";

export default function Home() {
  return (
    <>
      {/* <Navbar /> */}
      <div className={classes.main}>
        <ProductDisplay />
      </div>
    </>
  );
}
