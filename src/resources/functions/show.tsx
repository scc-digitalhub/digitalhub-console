import {
  Labeled,
  Show,
  SimpleShowLayout,
  TabbedShowLayout,
  TextField,
  useRecordContext,
  useTranslate,
} from "react-admin";
import { Grid, Typography } from "@mui/material";
import { getFunctionSpec, getFunctionUiSpec, getTaskByFunction } from "./types";
import { JsonSchemaField } from "@dslab/ra-jsonschema-input";
import { MetadataSchema } from "../../common/types";
import { Aside, FunctionList, PostShowActions, TaskComponent } from "../../components/helper";

const FunctionShowLayout = () => {
  const translate = useTranslate();
  const record = useRecordContext();
  const kind = record?.kind || undefined;
  if (!record)
  return <></>
  return (
    <TabbedShowLayout syncWithLocation={false}>
      <TabbedShowLayout.Tab label={translate("resources.function.tab.summary")}>
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
      </TabbedShowLayout.Tab>
      {getTaskByFunction(record?.kind).map((item,index) => (
        <TabbedShowLayout.Tab  label={item} key={index}>
            <div>
              <TaskComponent></TaskComponent>
              <FunctionList></FunctionList>
            </div>
        </TabbedShowLayout.Tab>
      ))}
    </TabbedShowLayout>
  );
};
export const FunctionShow = () => {
  return (
    <Show
      actions={<PostShowActions />}
      aside={<Aside />}
      sx={{ "& .RaShow-card": { width: "50%" } }}
    >
      <FunctionShowLayout />
    </Show>
  );
};
