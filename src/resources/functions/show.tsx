import {
  DateField,
  Labeled,
  RaRecord,
  Show,
  ShowButton,
  SimpleShowLayout,
  TextField,
  useDataProvider,
  useRecordContext,
  useResourceContext,
  useTranslate,
} from "react-admin";
import { Grid, Typography } from "@mui/material";
import { getFunctionSpec, getFunctionUiSpec } from "./types";
import { JsonSchemaField } from "@dslab/ra-jsonschema-input";
import { MetadataSchema } from "../../common/types";
import { useRootSelector } from "@dslab/ra-root-selector";
import { useState, useEffect } from "react";
import { PostShowActions } from "../../components/helper";
import {
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Table,
} from "@mui/material";

const Aside = () => {
  const record = useRecordContext();
  const resource = useResourceContext();
  const dataProvider = useDataProvider();
  const { root } = useRootSelector();
  const [versions, setVersions] = useState<RaRecord>();

  useEffect(() => {
    if (dataProvider && record && dataProvider) {
      dataProvider.getLatest(resource, { record, root }).then((versions) => {
        setVersions(versions.data);
      });
    }
  }, [dataProvider, record, resource]);
  if (!versions || !record || !dataProvider) return <></>;
  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">Version</TableCell>
            <TableCell align="center">Created</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {versions.map((item) => (
            <TableRow
              key={item.id}
              style={{
                backgroundColor: item.id === record.id ? "aliceblue" : "white",
              }}
            >
              <TableCell component="th" scope="row" align="center">
                {item.metadata?.version}
              </TableCell>
              <TableCell align="center"><DateField source="created" record={item.metadata} /></TableCell>
              <TableCell size="small" align="right">
                <ShowButton record={item} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export const FunctionShow = () => {
  const translate = useTranslate();
  const record = useRecordContext();
  const kind = record?.kind || undefined;

  return (
    <Show actions={<PostShowActions />} aside={<Aside />}>
      <Grid>
        <Typography variant="h6" gutterBottom>
          {translate("resources.function.title")}
        </Typography>

        <SimpleShowLayout>
          <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Labeled label="My Label">
              <TextField source="name" />
            </Labeled>
            </Grid>
            <Grid item xs={6}>
            <Labeled label="My Label">
              <TextField source="kind" />
            </Labeled>
            </Grid>
          </Grid>
          <JsonSchemaField source="metadata" schema={MetadataSchema} />
          <JsonSchemaField
            source="spec"
            schema={getFunctionSpec(kind)}
            uiSchema={getFunctionUiSpec(kind)}
            label={false}
          />
        </SimpleShowLayout>
      </Grid>
    </Show>
  );
};
