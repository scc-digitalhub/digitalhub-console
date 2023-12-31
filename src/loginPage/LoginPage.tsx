import { useMediaQuery, Theme } from "@mui/material";
import { Login, Title, useTranslate } from "react-admin";
import Box from "@mui/material/Box";
import { LoginButton } from "@dslab/ra-auth-oidc";
import { MyAppBar } from "../layout/MyAppBar";

export const LoginPage = () => {
  const isLarge = useMediaQuery<Theme>((theme) => theme.breakpoints.down("lg"));
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  return (
    <>
      <MyAppBar></MyAppBar>
      <Title title="titlePages.dashboard" />

      <Login
        sx={{
          backgroundImage: "none",
          "& .RaLogin-avatar": {
            display: "none",
          },
          "& .RaLogin-card": {
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left:
              !isLarge && !isSmall ? "30%" : isLarge && !isSmall ? "20%" : "5%",
            right:
              !isLarge && !isSmall ? "30%" : isLarge && !isSmall ? "20%" : "5%",
            top: "35%",
            marginTop: 0,
            minWidth: 0,
          },
        }}
      >
        <LoginCard />
      </Login>
    </>
  );
};

const LoginCard = () => {
  const translate = useTranslate();

  return (
    <Box style={{ padding: 20 }}>
      <Box textAlign="center">
        <h1>{translate("resources.dashboard.welcome")}</h1>
      </Box>

      <Box display="flex" justifyContent="center">
        <LoginButton />
      </Box>
    </Box>
  );
};
