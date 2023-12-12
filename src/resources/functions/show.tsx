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
import { getFunctionSpec, getFunctionUiSpec } from "./types";
import { JsonSchemaField } from "@dslab/ra-jsonschema-input";
import { MetadataSchema } from "../../common/types";
import { Aside, PostShowActions } from "../../components/helper";

const FunctionShowLayout = () => {
  const translate = useTranslate();
  const record = useRecordContext();
  const kind = record?.kind || undefined;
  console.log(record);
  return (
    <SimpleShowLayout>
      <TabbedShowLayout>
        <TabbedShowLayout.Tab
          label={translate("resources.function.tab.summary")}
        >
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
        <TabbedShowLayout.Tab
          label={translate("resources.function.tab.test")}
        ><div>test</div></TabbedShowLayout.Tab>
      </TabbedShowLayout>
    </SimpleShowLayout>
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
