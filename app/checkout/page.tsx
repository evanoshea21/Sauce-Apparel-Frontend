import Cart from "../components/checkout/Cart";
import Login from "../components/checkout/Login";
import CustomerProfile from "../components/checkout/CustomerProfile";
import CheckoutBtn from "../components/checkout/CheckoutBtn";

export default function CheckoutPage() {
  return (
    <div>
      <h1>Checkout Page</h1>

      {/* CART ITEMS HERE */}
      <Cart />
      {/* LOGIN COMPONENT HERE */}
      <Login />
      {/* DISPLAY USER CIM INFO HERE */}
      <CustomerProfile />
      {/* COMPLETE CHECKOUT BUTTON HERE */}
      <CheckoutBtn />
    </div>
  );
}
