import { ProductData } from "@/scripts/Types";
import classes from "@/styles/ProductCard.module.css";
import Link from "next/link";

interface Props {
  product: ProductData;
}

export default function ProductCard({ product }: Props) {
  let name: string;
  let fontSize: string;
  const nameL: number = product.name.length;
  if (nameL > 25 && nameL <= 35) {
    name = product.name;
    fontSize = "1.2em";
  } else if (nameL > 35 && nameL <= 45) {
    name = product.name;
    fontSize = "1.05em";
  } else if (nameL > 45) {
    name = product.name.slice(0, 42) + "...";
    fontSize = "1em";
  } else {
    // if short name
    name = product.name;
    fontSize = "1.3em";
  }

  let dollar: string = product.unitPrice.split(".")[0];
  let cents: string = `.${product.unitPrice.split(".")[1] ?? "00"}`;
  return (
    <div className={classes.main}>
      <div className={classes.imgBox}>
        <img src={product.imageUrl} alt="product image" />
      </div>
      <div className={classes.info}>
        <div className={classes.namePrice}>
          <p style={{ fontSize }} className={classes.name}>
            {name}
          </p>
          <div className={classes.price}>
            <span>$</span>
            <p>{dollar}</p>
            <span>{cents}</span>
          </div>
        </div>
        <Link href={`/products/${product.name.split(" ").join("-")}`}>
          <div className={classes.addToCartBtn}>Add to Cart</div>
        </Link>
      </div>
    </div>
  );
}
