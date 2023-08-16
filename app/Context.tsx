"use client";
import { SavedItem } from "@/scripts/Types";
import React from "react";

//create your context object
const Context = React.createContext({
  savedItemsGlobal: [{ name: "", img: "" }],
  setSavedItemsGlobal: function (items: SavedItem[]) {},
  cartRefreshGlobal: false,
  refreshCart: function () {},
});

interface Props {
  children: React.ReactNode;
}

//your react component
const ContextProvider = ({ children }: Props) => {
  //global state here
  const [savedItemsGlobal, setSavedItemsGlobal] = React.useState<SavedItem[]>(
    []
  );
  const [cartRefreshGlobal, setCartRefreshGlobal] =
    React.useState<boolean>(false);

  function refreshCart() {
    setCartRefreshGlobal((prev) => !prev);
  }

  return (
    //value= {} holds global state being passed
    <Context.Provider
      value={{
        savedItemsGlobal,
        setSavedItemsGlobal,
        cartRefreshGlobal,
        refreshCart,
      }}
    >
      {children}
    </Context.Provider>
  );
};
//end of reactcomponent
export { ContextProvider, Context };
