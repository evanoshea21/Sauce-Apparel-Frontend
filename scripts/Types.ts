export interface CartItem {
  itemId: string;
  name: string;
  quantity: string;
  unitPrice: number; // account for sales price

  description: string; // flavor/configs for SDK invoice
  img: string;
}

export interface Product {
  product: ProductData;
  flavors_inventory: FlavorsInventoryObj[];
}
export interface ProductData {
  id?: string; //optional bc CREATE payload doesn't need it
  name: string;
  unitPrice: string;
  imageUrl: string;

  description: string | null;
  inventory: number | null; //if no flavors
  salesPrice: string | null; // if no flavors
  category: string | null;
  isFeatured?: boolean;
}

export interface FlavorsInventoryObj {
  sku?: string; // don't need for CREATE
  flavor: string;
  inventory: number;
  salesPrice: string | null;
  productId: string; // returns for READ; for CREATE, pass empty string
}
