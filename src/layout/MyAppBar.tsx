import {
  RootResourceSelectorMenu,
  useRootSelector,
} from "@dslab/ra-root-selector";
import { AppBar, TitlePortal } from "react-admin";
import { Typography } from "@mui/material";

export const MyAppBar = () => {
  const { root: projectId } = useRootSelector();
  return (
    <AppBar sx={{ backgroundColor: "#FF8C00"}}>
      <Typography
        flex="1"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        overflow="hidden"
        variant="h6"
        color="inherit"
      >
        {projectId}
      </Typography>
      {/* <TitlePortal /> */}
      <RootResourceSelectorMenu source="name" showSelected={false} />
    </AppBar>
  );
};
