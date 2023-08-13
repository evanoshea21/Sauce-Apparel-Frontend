"use client";
import Link from "next/link";
import classes from "@/styles/NavBar.module.css";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Badge from "@mui/material/Badge";
import Drawer from "./Drawer";

export default function Navbar() {
  return (
    <div className={classes.main}>
      <nav className={classes.nav}>
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
          <div className={classes.saved}>
            <FavoriteBorderIcon className={classes.icon} />
            {/* <span className={classes.text}>Saved</span> */}
          </div>
          <div className={classes.profile}>
            <PersonOutlineIcon className={classes.icon} />
            <span className={classes.text}>Profile</span>
          </div>
          <div className={classes.cart}>
            <Badge className={classes.badge} badgeContent={2} color="primary">
              <ShoppingCartIcon className={classes.icon} />
            </Badge>
            {/* <span className={classes.text}>Cart</span> */}
          </div>
          <div className={classes.drawer}>
            <Drawer />
          </div>
        </div>
      </nav>
    </div>
  );
}
