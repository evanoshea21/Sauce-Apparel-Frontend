import type { CartItem, SavedItem, SizesInventoryObj } from "@/scripts/Types";

export function getCartItems() {
  if (typeof window === "undefined") return [];
  const cart_itemsJSON = localStorage.getItem("cart_items") || "[]";
  return JSON.parse(cart_itemsJSON);
}

export function getQOfItem(sku: string): number {
  let cartItems: CartItem[] = getCartItems();
  let quantity = 0;
  //find the item that matches sku, return it's quantity
  for (let item of cartItems) {
    if (item.sku === sku) {
      quantity = Number(item.quantity);
      break;
    }
  }

  return quantity;
}

export function clearCartItems() {
  localStorage.removeItem("cart_items");
}
export function addToCart(cartItem: CartItem) {
  const cartItemsJSON = localStorage.getItem("cart_items");

  if (!cartItemsJSON) {
    const items = [{ ...cartItem }];
    localStorage.setItem("cart_items", JSON.stringify(items));
  } else {
    const cartItems: CartItem[] = JSON.parse(cartItemsJSON);
    //first go through and see if this sku exists
    let alreadyThere = false;
    for (let item of cartItems) {
      if (cartItem.sku === item.sku) {
        //add item, set variable, break;
        item.quantity = String(
          Number(item.quantity) + Number(cartItem.quantity)
        );
        alreadyThere = true;
        break;
      }
    }
    //if it doesn't exist, then you can push as new item
    if (!alreadyThere) {
      cartItems.push({ ...cartItem });
    }
    localStorage.setItem("cart_items", JSON.stringify(cartItems));
  }
}

export function removeFromCart(sku: string) {
  let items: CartItem[] = getCartItems();
  items = items.filter((item: CartItem) => {
    return sku !== item.sku;
  });
  localStorage.setItem("cart_items", JSON.stringify(items));
}
export function changeQuantityCart(sku: string, newQ: number) {
  const item: CartItem = getCartItems().find(
    (item: CartItem) => item.sku === sku
  );
  //check if new q is in RANGE
  if (newQ <= (Number(item.maxQuantity) ?? 0)) {
    //update item
    item.quantity = String(newQ);
    //replace item in cart localstorage
    const cart: CartItem[] = getCartItems();
    // find item where sku matches
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].sku === sku) {
        cart[i] = item;
        break;
      }
    }
    localStorage.setItem("cart_items", JSON.stringify(cart));
    return "success";
  }
  return "error, hit max";
}

export function getCartSumAndCount(): { sum: number; count: number } {
  let cart_items = getCartItems();
  if (cart_items.length === 0) return { sum: 0, count: 0 };
  let sum: number = 0;
  let count: number = 0;
  cart_items.forEach((item: CartItem) => {
    sum += Number(item.unitPrice) * Number(item.quantity);
    count += Number(item.quantity);
  });
  return { sum, count };
}

export function isPositiveInteger(input: string | number): boolean {
  let num = Number(input);
  return Number.isInteger(num) && num >= 0;
}

export function isValidPrice(input: string | number): boolean {
  let num = Number(input);
  //must be positive
  if (num < 0) return false;
  let numString = String(input);
  let split = numString.split(".");
  // have max 1 decimal
  if (split.length > 2) return false;
  //digits be only
  if (split.length > 1 && split[split.length - 1].length > 2) {
    return false;
  }

  return true;
}

export function sizesHasLowInventory(
  sizesInv: SizesInventoryObj[],
  lessThanCount: number
): boolean {
  let hasLowInv: boolean = false;

  sizesInv.forEach((sizeObj: SizesInventoryObj) => {
    if (sizeObj.inventory < lessThanCount) {
      hasLowInv = true;
    }
  });

  return hasLowInv;
}

export function returnDateStr(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateStr = `${year}-${month}-${day}`;
  return dateStr;
}

export function roundPrice(price: number | string): string {
  let num = Number(price);
  num *= 100;
  let rounded = Math.round(num);
  let amountStr = String(rounded / 100);
  if (amountStr.indexOf(".") === -1) {
    amountStr += ".00";
  } else if (amountStr.split(".")[1].length === 1) {
    amountStr += "0";
  }
  return amountStr;
}

// SAVED ITEMS
export function getSavedItems() {
  const saved_itemsJSON = localStorage.getItem("saved_items") || "[]";
  return JSON.parse(saved_itemsJSON);
}
export function addToSaved(savedItem: SavedItem) {
  const savedItemsJSON = localStorage.getItem("saved_items");

  if (!savedItemsJSON) {
    const items = [{ ...savedItem }];
    localStorage.setItem("saved_items", JSON.stringify(items));
  } else {
    const savedItems = JSON.parse(savedItemsJSON);
    savedItems.push({ ...savedItem });
    localStorage.setItem("saved_items", JSON.stringify(savedItems));
  }
}
export function removeFromSaved(name: string) {
  let items: SavedItem[] = getSavedItems();
  items = items.filter((item: SavedItem) => {
    return name !== item.name;
  });
  localStorage.setItem("saved_items", JSON.stringify(items));
}

export function toSdkExpDate(date: string): string {
  if (date.indexOf("-") !== -1) {
    return date;
  }
  //remove slash if present
  date = date.replace("/", "");
  const month = date.slice(0, 2);
  const year = date.slice(-2);

  return `20${year}-${month}`;
}

// FETCH CALLS FOR SSR
interface Config {
  url: string;
  method: "POST" | "GET" | "DELETE";
  data: Record<string, any>;
}

export async function axiosCall(config: Config) {
  const response = await fetch(config.url, {
    method: config.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(config.data),
  });

  const data = await response.json();
  return data;
}

export function sortNormalSizes(sizeArr: string[]): string[] {
  let weights: { [key: string]: number } = {
    "one size": 1,
    xxs: 2,
    xs: 3,
    s: 4,
    m: 5,
    xl: 6,
    xxl: 7,
    small: 8,
    medium: 9,
    large: 10,
  };

  let sortedArray = sizeArr.sort((a, b) => {
    let aL = a.toLowerCase();
    let bL = b.toLowerCase();

    return weights[aL] - weights[bL];
  });

  return sortedArray;
}

export function returnShuffledArray(arr: any[]): any[] {
  const arrL = arr.length;
  let shuffleArray = [];
  let i;

  while (shuffleArray.length < arrL) {
    i = Math.floor(Math.random() * arr.length); // gets random index from spots left
    shuffleArray.push(arr.splice(i, 1)[0]);
  }
  return shuffleArray;
  //pick random one from input, splice it, push it in new array
}
