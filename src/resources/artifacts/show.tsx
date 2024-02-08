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
import { 
  LayoutContent,
  OutlinedCard,
  //Aside
   PostShowActions } from "../../components/helper";
import { memo, useEffect, useState } from "react";
import { arePropsEqual } from "../../common/helper";

const ShowComponent = (props: { setRecord: (record: any) => void }) => {
  const record = useRecordContext();

    useEffect(() => {
      props.setRecord(record);
    }, [record]);

    return <ArtifactShowLayout record={record}/>;
};

export const ArtifactShowLayout = memo(function ArtifactShowLayout(props: {
  record: any;
}) {
  const translate = useTranslate();
  const { record } = props;
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
}, arePropsEqual);

export const ArtifactShow = () => {
  const [record, setRecord] = useState(undefined);
  
  return (
    <LayoutContent record={record}>
      <Show
        actions={<PostShowActions />}
        sx={{ width: '100%' }}
        component={OutlinedCard}
      >
        <ShowComponent setRecord={setRecord} />
      </Show>
    </LayoutContent>
  );
};
