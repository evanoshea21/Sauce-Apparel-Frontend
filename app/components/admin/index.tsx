"use client";
import React from "react";
import ReadUpdateDelete from "./ReadUpdateDelete";
import Sidebar from "./Sidebar";
import classes from "@/styles/Admin.module.css";
import { useSession } from "next-auth/react";

interface Props {
  admins: string[];
}

export default function AdminClient({ admins }: Props) {
  const [loading, setLoading] = React.useState(true);
  const { data: session, status } = useSession();

  React.useEffect(() => {
    if (session !== undefined) {
      setLoading(false);
    }
  }, [session]);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "300px",
        }}
      >
        <p>Loading...</p>
      </div>
    );

  // check if current user is an admin
  if (!admins.includes(session?.user?.email ?? "not signed in")) {
    // if NOT an admin, show this page
    return (
      <div
        style={{
          width: "100%",
          height: "60vh",
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
          You must be logged in with an email that matches one on the list of
          admins in the <code style={{ fontSize: "1.1rem" }}>.env </code> file.
        </p>
      </div>
    );
  }

  return (
    <div className={classes.clientBox}>
      <Sidebar />
      <ReadUpdateDelete />
    </div>
  );
}
