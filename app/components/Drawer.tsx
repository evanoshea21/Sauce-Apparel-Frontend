// TEMP DRAWER
"use client";
import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import classes from "@/styles/NavBar.module.css";
import { useRouter } from "next/navigation";

export default function TemporaryDrawer() {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const router = useRouter();

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setIsOpen(open);
    };

  const list = () => (
    <Box
      sx={{ width: 250, pt: 2 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {["Disposable", "Salt Nic", "60ml", "120ml"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton sx={{ m: 0, p: 0 }}>
              {/* <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon> */}
              <ListItemText
                onClick={() =>
                  router.push(`/products/category/${text.split(" ").join("-")}`)
                }
                primary={text}
                sx={{
                  textAlign: "center",
                  borderBottom: "1px solid rgba(152, 152, 152, 0.242)",
                  pt: 2.2,
                  pb: 2.2,
                  boxSizing: "border-box",
                  m: 0,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {/* <Divider /> */}
      <List>
        {[].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <React.Fragment>
        {/* <Button onClick={toggleDrawer(true)}> */}
        <div className={classes.drawerIcon}>
          <MenuIcon onClick={toggleDrawer(true)} />
        </div>
        {/* </Button> */}
        <Drawer anchor={"right"} open={isOpen} onClose={toggleDrawer(false)}>
          {list()}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
