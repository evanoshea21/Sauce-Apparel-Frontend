"use client";
import classes from "@/styles/footer.module.css";
import Link from "next/link";

const Footer = () => {
  return (
    <div className={classes.main}>
      <div className={classes.left}>
        <h1>ECigCity</h1>
        <p>
          A Vape Shop based out of LA, selling flavored products online for
          pickup in store.
        </p>
        <p className={classes.plug}>
          Site made by{" "}
          <a target="_blank" href="https://evanoshea.dev">
            Evan O'Shea
          </a>{" "}
          &{" "}
          <a target="_blank" href="https://evanoshea.dev">
            Arie
          </a>
        </p>
        <div className={classes.socials}>
          <Link href="http://facebook.com">
            <img src="/fb.png" alt="facebook"></img>
          </Link>
          {/* <Link href="http://linkedin.com">
            <img src="/icons/linkedin.png" alt="linkedIn"></img>
          </Link> */}
        </div>
        <p style={{ margin: "30px 0 0 0" }}>
          Copyright © ECigCity {new Date().getFullYear()}
          <br />
          All rights reserved.
        </p>
      </div>
      <div className={classes.right}>
        <div className={classes.col1}>
          <h4>Contact</h4>
          <a href="">124 Main Street, LA, 94028</a>
          <a href="">916-482-1842</a>
          {/* <a href=""></a>
          <a href="">Service List</a> */}
        </div>
        <div className={classes.col2}>
          <h4>Socials</h4>
          <a href="">Facebook</a>
          <a href="">Instagram</a>
          <a href="">Tik Tok</a>
        </div>
        <div className={classes.col3}>
          <h4>Company</h4>
          <a href="">About Us</a>
          {/* <a href="">Contact Us</a>
          <a href="">Meet the Team</a> */}
          <a href="">Jobs</a>
        </div>
        <div className={classes.col4}>
          <h4>Information</h4>
          <a href="">Promotions</a>
          <a href="">Affiliate Program</a>
          <a href="">Testimonials</a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
