export interface CartItem {
  itemId: string;
  name: string;
  quantity: string;
  unitPrice: number;

  description: string; // flavor/configs for SDK invoice
  img: string;
}
export interface ProductStock {
  itemId: string;
  name: string;
  flavor: string;
  unitPrice: number;
  stock: number; // inventory available
  imageUrl: string;

  description?: string;
  salesPrice?: number;
  category?: string;
  isFeatured: boolean;
}
