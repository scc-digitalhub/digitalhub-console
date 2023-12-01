import { useLocation } from "react-router-dom";
import { useMediaQuery, Theme } from "@mui/material";
import { Layout } from "react-admin";
import { MyAppBar } from "./MyAppBar";
import { MyMenu } from "./MyMenu";

export const MyLayout = (props: any) => {
    const url = useLocation();
    let style = {};
    const isLarge = useMediaQuery<Theme>((theme) => theme.breakpoints.down("lg"));
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
  
    if (url.pathname === "/") {
      style = {
        position: "absolute",
        marginLeft: "auto",
        marginRight: "auto",
        left: !isLarge && !isSmall ? "30%" : isLarge && !isSmall ? "20%" : "5%",
        right: !isLarge && !isSmall ? "30%" : isLarge && !isSmall ? "20%" : "5%",
        top: "35%",
      };
    } else if (url.pathname === "/domains") {
      style = {
        position: "absolute",
        marginLeft: "auto",
        marginRight: "auto",
        left: "5%",
        right: "5%",
      };
    } else {
      style = {};
    }
  
    return (
      <Layout
        {...props}
        appBar={MyAppBar}
        menu={MyMenu}
        sx={{
          "& .RaLayout-content": style,
        }}
      />
    );
  };