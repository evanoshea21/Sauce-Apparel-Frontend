import { ProductData, Product } from "@/scripts/Types";
import classes from "@/styles/ProductDisplay.module.css";
import axios from "axios";
import ProductCard from "./ProductCard";

interface Props {
  products: Product[] | ProductData[];
}

export default async function ProductSlider({ products }: Props) {
  return (
    <div className={classes.sliderMain}>
      {/* <h1>Vapes For You!</h1> */}
      <div className={classes.boxForFade}>
        <div className={classes.sliderDisplay}>
          {products.map((product) => {
            return <ProductCard key={product.id} product={product} />;
          })}
          <div
            style={{
              display: "block",
              width: "200px",
              height: "300px",
              // backgroundColor: "blue",
            }}
          ></div>
        </div>
        <div className={classes.fade}></div>
      </div>

      {/* <div className={classes.flexContainer}>
        <div className={classes.box}>1</div>
        <div className={classes.box}>2</div>
        <div className={classes.box}>3</div>
        <div className={classes.box}>4</div>
        <div className={classes.box}>5</div>
        <div className={classes.box}>6</div>
        <div className={classes.box}>7</div>
        <div className={classes.box}>8</div>
        <div className={classes.box}>9</div>
      </div> */}
    </div>
  );
}
