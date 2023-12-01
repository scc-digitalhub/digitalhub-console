import { RootResourceSelectorMenu } from "@dslab/ra-root-selector";
import { AppBar, TitlePortal } from "react-admin";

export const MyAppBar = () => {
  return (
    <AppBar>
      <TitlePortal />
      <RootResourceSelectorMenu source="name" showSelected={false} />
    </AppBar>
  );
};
