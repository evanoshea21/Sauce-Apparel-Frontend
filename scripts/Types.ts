export interface CartItem {
  itemId: string;
  name: string;
  quantity: string;
  unitPrice: number; // account for sales price

  description: string; // flavor/configs for SDK invoice
  img: string;
}
export interface ProductStock {
  id?: string; //cart item (itemId)
  name: string; //cart item
  flavor: string; //cart item (description)
  unitPrice: number; //cart item
  stock: number; // inventory available
  imageUrl: string; // cart item

  description?: string; // don't need for cart
  salesPrice?: number; //veto cart item unitPrice if applicable
  category?: string; // dont need for cart
  isFeatured: boolean; // dont need for cart
}
