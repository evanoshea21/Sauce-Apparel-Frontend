"use client";
import Link from "next/link";
import classes from "@/styles/NavBar.module.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Badge from "@mui/material/Badge";
import Drawer from "./Drawer";
import { SavedNav, CartNav, LoginNav } from "./ClientElements";

export default function Navbar() {
  return (
    <div className={classes.main}>
      <nav className={classes.nav}>
        <Link href="/">
          <div className={classes.logo}>
            <div className={classes.imgBox}>
              <img
                width="100%"
                height="100%"
                src="https://logomakercdn.truic.com/ux-flow/industry/vape-shop-meta.png"
                alt="logo"
              />
              {/* <img width="100%" height="100%" src="/vape-logo-1.png" alt="logo" /> */}
            </div>
            <h1>ECigCity</h1>
          </div>
        </Link>
        <ul className={classes.links}>
          <li>
            <Link href="/">Categories</Link>
          </li>
          <li>
            <Link href="/">Deals</Link>
          </li>
          <li>
            <Link href="/">What's New</Link>
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
