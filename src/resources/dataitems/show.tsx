import { JsonSchemaField } from "@dslab/ra-jsonschema-input";
import { Grid } from "@mui/material";
import * as changeCase from "change-case";
import { ReactElement, memo } from "react";
import {
  Datagrid,
  Labeled,
  ListContextProvider,
  Show,
  TabbedShowLayout,
  TextField,
  useList,
  useRecordContext,
  useTranslate,
} from "react-admin";
import { MetadataSchema } from "../../common/types";
import { Aside, PostShowActions } from "../../components/helper";
import { getReactField, isFieldValid } from "./helper";
import { DataItemSpecSchema, DataItemSpecUiSchema } from "./types";
import { Typography } from "@mui/material";

const arePropsEqual = (oldProps: any, newProps: any) => {
  if (!newProps.record) return true;
  return Object.is(oldProps.record, newProps.record);
};

const ShowComponent = () => {
  const record = useRecordContext();
  return <DataItemShowLayout record={record} />;
};

const DataItemShowLayout = memo(function DataItemShowLayout(props: {
  record: any;
}) {
  const translate = useTranslate();
  
  if (!props.record) return <></>;
  return (
    <TabbedShowLayout syncWithLocation={false} record={props.record}>
      <TabbedShowLayout.Tab label="resources.dataitem.tab.summary">
        <Grid>
          <Typography variant="h6" gutterBottom>
            {translate("resources.dataitem.title")}
          </Typography>

          <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={6}>
              <Labeled label="resources.dataitem.name">
                <TextField source="name" />
              </Labeled>
            </Grid>
            <Grid item xs={6}>
              <Labeled label="resources.dataitem.kind">
                <TextField source="kind" />
              </Labeled>
            </Grid>
          </Grid>

          <JsonSchemaField source="metadata" schema={MetadataSchema} />

          <JsonSchemaField
            source="spec"
            schema={DataItemSpecSchema}
            uiSchema={DataItemSpecUiSchema}
            label="resources.dataitem.summary.spec.title"
          />
        </Grid>
      </TabbedShowLayout.Tab>
      <TabbedShowLayout.Tab label="resources.dataitem.tab.schema">
        <SchemaTabComponent record={props.record} />
      </TabbedShowLayout.Tab>
      <TabbedShowLayout.Tab label="resources.dataitem.tab.preview">
        <PreviewTabComponent record={props.record} />
      </TabbedShowLayout.Tab>
    </TabbedShowLayout>
  );
},
arePropsEqual);

export const DataItemShow = () => {
  return (
    <Show
      actions={<PostShowActions />}
      aside={<Aside />}
      sx={{ "& .RaShow-card": { width: "50%" } }}
    >
      <ShowComponent />
    </Show>
  );
};

const SchemaTabComponent = (props: { record: any }) => {
  const schema = props.record?.spec?.schema || [];
  const listContext = useList({ data: schema });

  const map = new Map<string, ReactElement>();
  schema
    .filter((fieldDescriptor) => Object.keys(fieldDescriptor).length > 2)
    .forEach((fieldDescriptor) => {
      const filteredKeys = Object.keys(fieldDescriptor).filter(
        (key) => key !== "name" && key !== "type"
      );
      filteredKeys.forEach((key, i) => {
        if (!map.has(key)) {
          map.set(
            key,
            <TextField source={key} key={`dataitem-schema-${key}-${i}`} />
          );
        }
      });
    });

  const reactFields = Array.from(map.values());

  return (
    <ListContextProvider value={listContext}>
      <Datagrid bulkActionButtons={false}>
        <TextField source="name" label="resources.dataitem.schema.name" />
        <TextField source="type" label="resources.dataitem.schema.type" />
        {reactFields && reactFields.map((field) => field)}
      </Datagrid>
    </ListContextProvider>
  );
};

const PreviewTabComponent = (props: { record: any }) => {
  const schema = props.record?.spec?.schema || [];
  const reactFields: ReactElement[] = [];

  schema.forEach((fieldDescriptor: any, i: number) => {
    reactFields.push(getReactField(fieldDescriptor, i));
  });

  const data: any[] = [];
  const preview = props.record?.status?.preview || [];

  preview.forEach((obj) => {
    const field = changeCase.camelCase(obj.name);

    const fieldDescriptor = schema.find((s) => s.name === obj.name);
    const isValid = isFieldValid(fieldDescriptor);

    obj.value.forEach((v: any, i: number) => {
      const value = isValid ? v : undefined;
      data[i] ? (data[i][field] = value) : (data[i] = { [field]: value });
    });
  });

  const listContext = useList({ data });

  return (
    <ListContextProvider value={listContext}>
      <Datagrid bulkActionButtons={false}>
        {reactFields && reactFields.map((field) => field)}
      </Datagrid>
    </ListContextProvider>
  );
};
