import {
  Labeled,
  Show,
  SimpleShowLayout,
  TextField,
  useRecordContext,
  useTranslate,
} from "react-admin";
import { Grid, Typography } from "@mui/material";
import { JsonSchemaField } from "@dslab/ra-jsonschema-input";
import { MetadataSchema } from "../../common/types";
import { getArtifactSpec, getArtifactUiSpec } from "./types";
import { Aside, PostShowActions } from "../../components/helper";

export const ArtifactShowLayout = () => {
  const translate = useTranslate();
  const record = useRecordContext();
  const kind = record?.kind || undefined;
  return (
      <Grid>
        <Typography variant="h6" gutterBottom>
          {translate("resources.artifact.title")}
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
            schema={getArtifactSpec(kind)}
            uiSchema={getArtifactUiSpec(kind)}
            label={false}
          />
        </SimpleShowLayout>
      </Grid>
  );
};

export const ArtifactShow = () => {
  return (
    <Show
      actions={<PostShowActions />}
      aside={<Aside />}
      sx={{ "& .RaShow-card": { width: "50%" } }}
    >
      <ArtifactShowLayout />
    </Show>
  );
};
