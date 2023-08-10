import type { CartItem, FlavorsInventoryObj } from "@/scripts/Types";

export function getCartItems() {
  const cart_itemsJSON = localStorage.getItem("cart_items") || "[]";
  return JSON.parse(cart_itemsJSON);
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
    const cartItems = JSON.parse(cartItemsJSON);
    cartItems.push({ ...cartItem });
    localStorage.setItem("cart_items", JSON.stringify(cartItems));
  }
}
export function removeFromCart(sku: string) {
  let items: CartItem[] = getCartItems();
  items = items.filter((item: CartItem) => {
    sku !== item.sku;
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

export function getCartSum(): number {
  let cart_items = getCartItems();
  if (cart_items.length === 0) return 0;
  let sum: number = 0;
  cart_items.forEach(
    (item: CartItem) => (sum += Number(item.unitPrice) * Number(item.quantity))
  );
  return sum;
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

export function flavorsHasLowInventory(
  flavorsInv: FlavorsInventoryObj[],
  lessThanCount: number
): boolean {
  let hasLowInv: boolean = false;

  flavorsInv.forEach((flavorObj: FlavorsInventoryObj) => {
    if (flavorObj.inventory < lessThanCount) {
      hasLowInv = true;
    }
  });

  return hasLowInv;
}
