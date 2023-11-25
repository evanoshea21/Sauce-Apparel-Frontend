import AdminClient from "../components/admin";
import Header from "../components/admin/Header";
import classes from "@/styles/Admin.module.css";

export default function AdminPage() {
  const admins = process.env.ADMINS?.split(",") ?? [];

  return (
    <div>
      {/* <h1 style={{ textAlign: "center", fontSize: "3rem" }}>Admin Page</h1> */}
      <div className={classes.main}>
        <Header />
        <AdminClient admins={admins} />
      </div>
    </div>
  );
}
