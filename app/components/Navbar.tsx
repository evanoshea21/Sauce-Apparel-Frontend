"use client";
import Link from "next/link";
import classes from "@/styles/NavBar.module.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Badge from "@mui/material/Badge";
import Drawer from "./Drawer";
import { SavedNav, CartNav, LoginNav } from "./ClientElements";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  if (pathname === "/admin") return <></>;

  return (
    <div
      className={classes.main}
      // style={{
      //   display: pathname === "/admin" ? "none" : "",
      // }}
    >
      <nav className={classes.nav}>
        <Link href="/">
          <div className={classes.logo}>
            <div className={classes.imgBox}>
              <img
                width="100%"
                height="100%"
                src="https://t4.ftcdn.net/jpg/03/21/98/71/360_F_321987179_mJndthZlqmXBXAAYOXE6pMJaHVlqxufa.jpg"
                alt="logo"
              />
              {/* <img width="100%" height="100%" src="/vape-logo-1.png" alt="logo" /> */}
            </div>
            <h1>
              Sauce
              <br />
              Apparel
            </h1>
          </div>
        </Link>
        <ul className={classes.links}>
          <li>
            <Link href="/products/category/Tees">Tees</Link>
          </li>
          <li>
            <Link href="/products/category/Pants">Pants</Link>
          </li>
          <li>
            <Link href="/products/category/Hoodies">Hoodies</Link>
          </li>
          <li>
            <Link href="/products/category/Hats">Hats</Link>
          </li>
        </ul>
        <div className={classes.rightBtns}>
          <SavedNav />
          <LoginNav />
          <CartNav />
          <div className={classes.drawer}>
            <Drawer />
          </div>
        </div>
      </nav>
    </div>
  );
}
