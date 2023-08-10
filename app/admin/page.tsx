import AdminProductsCRUD from "../components/adminProducts";

export default function AdminPage() {
  const adminList = process.env.ADMINS?.split(",");
  // check if current user is an admin
  if (false) {
    // if NOT an admin, show this page
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 style={{ textAlign: "center" }}>
          Sorry, you don't have administrative access.
        </h1>
        <p>
          You must be logged in with an email that matches one that's on the{" "}
          <code style={{ fontSize: "1.1rem" }}>.env </code> list of admins.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1>Admin Page</h1>
      <AdminProductsCRUD />
    </div>
  );
}
