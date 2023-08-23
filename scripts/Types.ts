export type Categories =
  | "Disposable"
  | "60ml"
  | "120ml"
  | "Salt Nic"
  | "Other"
  | null;

export const categoryArr: Categories[] = [
  "Disposable",
  "60ml",
  "120ml",
  "Salt Nic",
  "Other",
];
export interface CartItem {
  sku: string;
  name: string;
  quantity: string;
  maxQuantity?: string;
  unitPrice: string; // account for sales price

  description: string; // flavor choice, sku
  img: string;
}
export interface SavedItem {
  name: string;
  img: string;
}

export interface Product extends ProductData {
  Flavors_Inventory?: FlavorsInventoryObj[];
}
export interface ProductData {
  id?: string; //optional bc CREATE payload doesn't need it
  name: string;
  unitPrice: string;
  imageUrl: string;

  description: string | null;
  salesPrice: string | null; // if no flavors
  category: string | null;
  isFeatured?: boolean;
}

export interface FlavorsInventoryObj {
  sku?: string; // don't need for CREATE
  flavor: string;
  inventory: number;
  productId: string; // returns for READ; for CREATE, pass empty string
}

export interface Order {
  //for refund
  refTransId: string;
  amountCharged: string;
  subtotal: string;
  cardNum: string;
  expDate: string;
  //to ref customer who purchased
  userId: string;
}
export interface PurchasedItem extends CartItem {
  // basically a cartItem, with saved time and referencing Order in DB
  refTransId: string;
}

//ADD CARD (bill To form, credit card form)
export interface CustomerProfile {
  customerProfileId: string;
  description: string;
  email: string;
  merchantCustomerId: string;
  paymentProfiles: PaymentProfile[];
  profileType: string;
}
export interface PaymentProfile {
  billTo: Address;
  customerPaymentProfileId: string;
  customerType: string;
  payment: {
    creditCard: {
      cardNumber: string;
      cardType: string;
      expirationDate: string;
    };
  };
}

export interface Address {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}
export interface AddCardData {
  customerProfileId: string;
  cardNumber: string;
  expDate: string;
  billTo: Address;
}

// GUEST CHECKOUT
export interface CartItem2 {
  sku: string;
  name: string;
  description: string;
  quantity: string;
  unitPrice: string;
}
interface Address2 {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface ChargeCardData {
  creditCard: {
    cardNumber: string;
    expDate: string;
    cvv: string;
  };
  invoiceNum: string;
  description: string;
  amount: string;
  billTo: Address2;
  ordered_items: CartItem2[];
}
