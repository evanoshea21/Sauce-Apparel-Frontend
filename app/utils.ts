import type { Product } from "@/scripts/Types";

export function getCartItems() {
  const cart_itemsJSON = localStorage.getItem("cart_items") || "[]";
  return JSON.parse(cart_itemsJSON);
}
export function getCartSum(): number {
  let cart_items = getCartItems();
  if (cart_items.length === 0) return 0;
  let sum: number = 0;
  cart_items.forEach(
    (item: Product) => (sum += item.unitPrice * Number(item.quantity))
  );
  return sum;
}
