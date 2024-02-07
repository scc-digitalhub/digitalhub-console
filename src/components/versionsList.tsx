import {
  Link,
  RaRecord,
  ShowButton,
  useCreatePath,
  useDataProvider,
  useRecordContext,
  useResourceContext,
  useTranslate,
} from "react-admin";
import {
  Typography,
  Box,
  List as MuiList,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  SxProps,
  Theme,
} from "@mui/material";

import { useRootSelector } from "@dslab/ra-root-selector";
import { useState, useEffect } from "react";

export type VersionListProps = {
  showActions?: boolean;
  sx?: SxProps<Theme>;
  record: any
};

export const VersionsList = (props: VersionListProps) => {
  const { showActions = true, sx, record } = props;
  //const record = useRecordContext();
  const resource = useResourceContext();
  const dataProvider = useDataProvider();
  const { root } = useRootSelector();
  const translate = useTranslate();
  const createPath = useCreatePath();

  const [versions, setVersions] = useState<RaRecord[]>();

  useEffect(() => {
    if (dataProvider) {
      dataProvider.getLatest(resource, { record, root }).then((versions) => {
        setVersions(versions.data);
      });
    }
  }, [dataProvider, record, resource]);

  if (!versions || !record || !dataProvider) return <></>;

  const sxProps = showActions
    ? { ml: 8, pl: 4, ...sx }
    : { ml: 2, pl: 1, mr: 2, ...sx };

  return (
    <Box sx={sxProps}>
      {/* <Typography variant="body1" sx={{}}>
        {translate("versions")}
      </Typography> */}
      <MuiList>
        {versions.map((item) => {
          const path = createPath({
            type: "show",
            resource: resource,
            id: item.id,
          });
          return (
            <ListItem disablePadding key={resource + ":versions:" + item.id}>
              <Link to={path}>
                <ListItemText
                  primary={item.id}
                  secondary={item.metadata.updated}
                />
              </Link>
              {showActions && (
                <ListItemSecondaryAction>
                  <ShowButton record={item} />
                </ListItemSecondaryAction>
              )}
            </ListItem>
          );
        })}
      </MuiList>
    </Box>
  );
};
