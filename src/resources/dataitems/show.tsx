import { Show, SimpleShowLayout, TextField, useRecordContext, useTranslate } from "react-admin";
  import { Grid, Typography } from "@mui/material";
  import { JsonSchemaField } from "@dslab/ra-jsonschema-input";
import { MetadataSchema } from "../../common/types";
import { getDataItemSpec, getDataItemUiSpec } from "./types";
import { PostShowActions } from "../../components/helper";


  
// const PostShowActions = () => (
//   <TopToolbar>
//      <BackButton />
//       <EditButton  style={{marginLeft:'auto'}}/>      <InspectButton />
//       <ExportRecordButton language="yaml" />
//       <DeleteWithConfirmButton/>
//   </TopToolbar>
// );
  export const DataItemShow = () => {
    const translate = useTranslate();
    const record = useRecordContext();
    const kind = record?.kind || undefined;
  
    return (
      <Show actions={<PostShowActions />}>
        <div>
          <Grid container width={{ xs: "100%", xl: 800 }} spacing={2}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
              {translate("resources.dataitem.title")}
              </Typography>
  
              <SimpleShowLayout>
                <TextField source="name" />
                <TextField source="kind" />
                <JsonSchemaField source="metadata" schema={MetadataSchema} />
                <JsonSchemaField
                  source="spec"
                  schema={getDataItemSpec(kind)}
                  uiSchema={getDataItemUiSpec(kind)}
                  label={false}
                />
              </SimpleShowLayout>
            </Grid>
          </Grid>
        </div>
      </Show>
    );
  };
  