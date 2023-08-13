import Image from "next/image";
import classes from "@/styles/Home.module.css";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className={classes.main}>Hero on Home page</div>
    </>
  );
}
