import classes from "@/styles/Admin.module.css";

export default function Header() {
  return (
    <div className={classes.header}>
      <h1>
        ECigCity
        <span style={{ color: "grey", fontWeight: "400" }}> | Admin Page</span>
      </h1>
    </div>
  );
}
