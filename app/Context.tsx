"use client";
import { SavedItem } from "@/scripts/Types";
import React from "react";

//create your context object
const Context = React.createContext({
  savedItemsGlobal: [{ name: "", img: "" }],
  setSavedItemsGlobal: function (items: SavedItem[]) {},
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

  return (
    //value= {} holds global state being passed
    <Context.Provider
      value={{
        savedItemsGlobal,
        setSavedItemsGlobal,
      }}
    >
      {children}
    </Context.Provider>
  );
};
//end of reactcomponent
export { ContextProvider, Context };
