import { DeleteWithConfirmButton, EditButton, Show, SimpleShowLayout, TextField, TopToolbar, useRecordContext, useTranslate } from "react-admin";
  import { Grid, Typography } from "@mui/material";
  import { JsonSchemaField } from "@dslab/ra-jsonschema-input";
import { MetadataSchema } from "../../common/types";
import { getArtifactSpec, getArtifactUiSpec } from "./types";
import { ExportRecordButton } from "@dslab/ra-export-record-button";
import { InspectButton } from "@dslab/ra-inspect-button";


const PostShowActions = () => (
  <TopToolbar>
      <EditButton />
      <InspectButton />
      <ExportRecordButton language="yaml" />
      <DeleteWithConfirmButton/>
  </TopToolbar>
);
  export const ArtifactShow = () => {
    const translate = useTranslate();
    const record = useRecordContext();
    const kind = record?.kind || undefined;
  
    return (
      <Show actions={<PostShowActions />}>
        <div>
          <Grid container width={{ xs: "100%", xl: 800 }} spacing={2}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                {translate("resources.artifact.title")}
              </Typography>
  
              <SimpleShowLayout>
                <TextField source="name" />
                <TextField source="kind" />
                <JsonSchemaField source="metadata" schema={MetadataSchema} />
                <JsonSchemaField
                  source="spec"
                  schema={getArtifactSpec(kind)}
                  uiSchema={getArtifactUiSpec(kind)}
                  label={false}
                />
              </SimpleShowLayout>
            </Grid>
          </Grid>
        </div>
      </Show>
    );
  };
  