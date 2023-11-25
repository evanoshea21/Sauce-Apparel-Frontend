"use client";
import React from "react";
import {
  addToSaved,
  getCartItems,
  getCartSumAndCount,
  getSavedItems,
  removeFromSaved,
} from "../utils";
import type { SavedItem } from "@/scripts/Types";
import classes from "@/styles/ClientElements.module.css";
import navClasses from "@/styles/NavBar.module.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Context } from "../Context";
import { useRouter } from "next/navigation";
import Badge from "@mui/material/Badge";
import Link from "next/link";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { signOut, signIn, useSession } from "next-auth/react";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Dialog from "@mui/material/Dialog";
import SignIn from "@/app/components/checkout/paymentComponents/SignIn";

// savedItemsGlobal, setSavedItemsGlobal

interface Props {
  product: SavedItem;
}

export function SaveBtn({ product }: Props) {
  const { savedItemsGlobal, setSavedItemsGlobal } = React.useContext(Context);
  const [isSaved, setIsSaved] = React.useState<boolean>(false);
  //check if button name is in 'save' localStorage
  //render apt button
  React.useEffect(() => {
    // check if product name inside saved items
    let isSavedItem = false;
    for (let i = 0; i < savedItemsGlobal.length; i++) {
      if (savedItemsGlobal[i].name === product.name) {
        isSavedItem = true;
        break;
      }
    }
    setIsSaved(isSavedItem);
  }, [savedItemsGlobal]);

  function addSaved() {
    addToSaved(product);
    setSavedItemsGlobal(getSavedItems());
  }
  function removeSaved() {
    removeFromSaved(product.name);
    setSavedItemsGlobal(getSavedItems());
  }

  if (isSaved) {
    return (
      <div onClick={removeSaved} className={classes.saveBtn}>
        <FavoriteIcon />
      </div>
    );
  } else {
    return (
      <div onClick={addSaved} className={classes.saveBtn}>
        <FavoriteBorderIcon />
      </div>
    );
  }
}

export function SavedNav() {
  const { savedItemsGlobal, setSavedItemsGlobal } = React.useContext(Context);
  const [savedArr, setSavedArr] = React.useState<SavedItem[]>([]);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [refresh, setRefresh] = React.useState<boolean>(false);
  const router = useRouter();

  React.useEffect(() => {
    if (isOpen) {
      let savedItems = getSavedItems();
      setSavedArr(savedItems);
    }
  }, [isOpen, refresh, savedItemsGlobal]);

  React.useEffect(() => {
    if (savedItemsGlobal.length === 0) {
      setIsOpen(false);
    }
  }, [savedItemsGlobal]);

  React.useEffect(() => {
    setSavedItemsGlobal(getSavedItems());
  }, []);

  function removeSaved(e: any, name: string) {
    e.stopPropagation();
    removeFromSaved(name);
    setRefresh((prev) => !prev);
    setSavedItemsGlobal(getSavedItems());
  }

  return (
    <div
      onClick={() => setIsOpen((prev) => !prev)}
      className={`${navClasses.saved} ${classes.savedNav}`}
    >
      {savedItemsGlobal.length > 0 ? (
        <Badge color="primary" badgeContent={savedItemsGlobal.length}>
          <FavoriteIcon className={navClasses.icon} />
        </Badge>
      ) : (
        <FavoriteBorderIcon className={navClasses.icon} />
      )}
      {isOpen && (
        <div className={classes.savedNavDropdown}>
          {savedArr.map((item, i) => {
            return (
              <div key={`${item.name}-${i}`}>
                <div
                  onClick={() => {
                    router.push(`/products/${item.name.split(" ").join("-")}`);
                  }}
                  className={classes.savedNavRow}
                >
                  <div className={classes.imgBox}>
                    <img src={item.img} alt="image" />
                  </div>
                  <span>
                    {item.name.length > 30
                      ? item.name.slice(0, 30) + "..."
                      : item.name}
                  </span>
                  <div
                    style={{
                      paddingLeft: "8px",
                      paddingRight: "5px",
                      // border: "1px solid red",
                      height: "70px",
                      color: "red",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={(e) => removeSaved(e, item.name)}
                  >
                    <DeleteForeverIcon />
                  </div>
                </div>
                {savedArr.length > 1 && (
                  <div className={classes.savedNavBorder}></div>
                )}
              </div>
            );
          })}
          {savedArr.length === 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "80px",
                color: "grey",
              }}
            >
              No items saved
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function CartNav() {
  const { cartRefreshGlobal } = React.useContext(Context);
  const [itemsCount, setItemsCount] = React.useState<number | undefined>();

  React.useEffect(() => {
    setItemsCount(getCartSumAndCount().count);
  }, []);

  React.useEffect(() => {
    setItemsCount(getCartSumAndCount().count);
  }, [cartRefreshGlobal]);

  return (
    <div className={navClasses.cart}>
      <Link href="/checkout">
        {itemsCount && itemsCount > 0 ? (
          <Badge
            className={navClasses.badge}
            badgeContent={itemsCount}
            color="primary"
          >
            <ShoppingCartIcon className={navClasses.icon} />
          </Badge>
        ) : (
          <ShoppingCartIcon className={navClasses.icon} />
        )}
      </Link>
    </div>
  );
}

export function LoginNav() {
  const { data: session, status } = useSession();
  const [openD, setOpenD] = React.useState<boolean>(false);
  const [display, setDisplay] = React.useState<"loading" | undefined>();

  if (status === "loading" && false) {
    return <></>;
  } else if (status === "unauthenticated") {
    return (
      <div className={navClasses.profile}>
        <div onClick={() => setOpenD(true)} className={classes.logIn}>
          Log in
        </div>
        <div className={classes.dialogContainer}>
          <Dialog onClose={() => setOpenD(false)} open={openD}>
            <div className={classes.logInDialog}>
              {display === "loading" ? (
                <h2 style={{ textAlign: "center" }}>Logging you in...</h2>
              ) : (
                <SignIn isModal={true} setDisplayHome={setDisplay} />
              )}
            </div>
          </Dialog>
        </div>
      </div>
    );
  }
  return (
    <div className={navClasses.profile}>
      <PersonOutlineIcon className={navClasses.icon} />
      <span className={navClasses.text}>Profile</span>
      <div onClick={() => signOut()} className={navClasses.signOut}>
        sign out
      </div>
    </div>
  );
}
