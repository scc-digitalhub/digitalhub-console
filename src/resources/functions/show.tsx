import {
  Labeled,
  RecordContextProvider,
  Show,
  SimpleShowLayout,
  TabbedShowLayout,
  TextField,
  useDataProvider,
  useGetList,
  useRecordContext,
  useTranslate,
} from "react-admin";
import { Grid, Typography } from "@mui/material";
import { getFunctionSpec, getFunctionUiSpec, getTaskByFunction } from "./types";
import { JsonSchemaField } from "@dslab/ra-jsonschema-input";
import { MetadataSchema } from "../../common/types";
import { 
  LayoutContent,
  OutlinedCard,
  //Aside, 
  PostShowActions } from "../../components/helper";
import { TaskAndRun } from "./TaskAndRun";
import { memo, useEffect, useState } from "react";
import { arePropsEqual } from "../../common/helper";
// import { useEffect } from "react";

const ShowComponent = (props: { setRecord: (record: any) => void }) => {
  const record = useRecordContext();

  useEffect(() => {
      props.setRecord(record);
  }, [record]);

  return <FunctionShowLayout record={record} />;
}

const FunctionShowLayout = memo(function FunctionShowLayout(props: {
  record: any;
}){
  const translate = useTranslate();
  const { record } = props;
  const dataProvider = useDataProvider();
  const kind = record?.kind || undefined;
  const [tasks, setTasks] = useState<any>();
  const { data, isLoading, error } = useGetList("tasks", {
    filter: {
      function: `${record?.kind}://${record?.project}/${record?.name}:${record?.id}`,
    },
  });
  useEffect(() => {
    if (!isLoading && data && record) {
      const mapTask = {};
      getTaskByFunction(record?.kind)?.forEach(async (kind) => {
        //task=profile
        //check task for function contains a task with kind of profile
        let typeTask = data?.find((data) => kind === data.kind);
        if (!typeTask) {
          //crealo con await su dataprovider
          const task = await dataProvider.create("tasks", {
            data: {
              project: record?.project,
              kind: kind,
              spec: {
                function: `${record?.kind}://${record?.project}/${record?.name}:${record?.id}`,
              },
            },
          });
          //  .then(response => console.log(response))
          //array locale
          if (task) {
            mapTask[kind] = typeTask;
          }
        } else {
          console.log("kind" + kind + " presente" + JSON.stringify(data));
          mapTask[kind] = typeTask;
        }
      });
      //setTask con array locale + task esistenti in data. Uso mappa per tipo {profile: {...}, validate: {{}}}
      setTasks(mapTask);
    }
  }, [dataProvider, data, isLoading]);
  // if (isLoading) {
  //   return <></>;
  // }
  if (error) {
    return <p>ERROR</p>;
  }
  if (!record || !tasks) return <></>;

  return (
    <TabbedShowLayout syncWithLocation={false} record={record}>
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
      {getTaskByFunction(record?.kind).map((item, index) => (
        <TabbedShowLayout.Tab label={item} key={index}>
          <div>
            <RecordContextProvider value={tasks[item]}>
              <TaskAndRun key={item.id} />
            </RecordContextProvider>
          </div>
        </TabbedShowLayout.Tab>
      ))}
    </TabbedShowLayout>
  );
}, arePropsEqual);

export const FunctionShow = () => {
  const [record, setRecord] = useState(undefined);
  return (
    <LayoutContent record={record}>
      <Show
        actions={<PostShowActions />}
        sx={{ width: '100%' }}
        component={OutlinedCard}
      >
        <ShowComponent setRecord={setRecord}/>
      </Show>
    </LayoutContent>
  );
};
