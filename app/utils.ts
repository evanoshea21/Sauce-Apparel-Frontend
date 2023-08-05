import type { CartItem } from "@/scripts/Types";

export function getCartItems() {
  const cart_itemsJSON = localStorage.getItem("cart_items") || "[]";
  return JSON.parse(cart_itemsJSON);
}
export function getCartSum(): number {
  let cart_items = getCartItems();
  if (cart_items.length === 0) return 0;
  let sum: number = 0;
  cart_items.forEach(
    (item: CartItem) => (sum += item.unitPrice * Number(item.quantity))
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
