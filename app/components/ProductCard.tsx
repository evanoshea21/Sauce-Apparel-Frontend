import { ProductData } from "@/scripts/Types";
import classes from "@/styles/ProductCard.module.css";
import Link from "next/link";
import { SaveBtn } from "./ClientElements";

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
  let dollarSale: string | undefined = undefined;
  let centsSale: string | undefined = undefined;
  if (product.salesPrice) {
    dollarSale = product.salesPrice.split(".")[0];
    centsSale = `.${product.salesPrice.split(".")[1] ?? "00"}`;
  }
  return (
    <div className={classes.main}>
      <div className={classes.imgBox}>
        {product.salesPrice && <div className={classes.onSaleTag}>On Sale</div>}
        <img src={product.imageUrl} alt="product image" />
      </div>
      <div className={classes.info}>
        <div className={classes.namePrice}>
          <p style={{ fontSize }} className={classes.name}>
            {name}
          </p>
          <div className={classes.price}>
            {product.salesPrice ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", color: "red" }}>
                  <span>$</span>
                  <p>{dollarSale}</p>
                  <span>{centsSale}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    fontSize: "1.3rem",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      width: "75%",
                      height: "2px",
                      borderBottom: "2px solid red",
                      top: "40%",
                      transform: "rotate(-5deg)",
                    }}
                  ></div>
                  <span>$</span>
                  <p>{dollar}</p>
                  <span>{cents}</span>
                </div>
              </div>
            ) : (
              <>
                <span>$</span>
                <p>{dollar}</p>
                <span>{cents}</span>
              </>
            )}
          </div>
        </div>
        <div className={classes.bottomLinks}>
          <Link href={`/products/${product.name.split(" ").join("-")}`}>
            <div className={classes.addToCartBtn}>Add to Cart</div>
          </Link>
          <SaveBtn product={{ name: product.name, img: product.imageUrl }} />
        </div>
      </div>
    </div>
  );
}
