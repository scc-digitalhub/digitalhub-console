import {
  Labeled,
  RecordContextProvider,
  Show,
  ShowBase,
  ShowView,
  SimpleShowLayout,
  TabbedShowLayout,
  TextField,
  useDataProvider,
  useGetList,
  useRecordContext,
  useShowContext,
  useTranslate,
} from "react-admin";
import { Grid, Typography } from "@mui/material";
import { getFunctionSpec, getFunctionUiSpec, getTaskByFunction } from "./types";
import { JsonSchemaField } from "@dslab/ra-jsonschema-input";
import { MetadataSchema } from "../../common/types";
import {
  Aside,
  PostShowActions,
} from "../../components/helper";
import { TaskAndRun } from "./TaskAndRun";
import { useEffect, useState } from "react";
// import { useEffect } from "react";

const FunctionShowLayout = () => {
  const translate = useTranslate();
  const record = useRecordContext();
  const dataProvider = useDataProvider();
  const kind = record?.kind || undefined;
  const [tasks, setTasks] = useState<any>();
  const { data,  isLoading, error } = useGetList(
    'tasks',
    {
        filter: {function:`${record?.kind}://${record?.project}/${record?.name}:${record?.id}`},
    }
    );
    useEffect(()=> {
      if ( !isLoading && data && record) {
        const mapTask={};
       getTaskByFunction(record?.kind)?.forEach(async kind => { //task=profile
         //check task for function contains a task with kind of profile
         let typeTask =data?.find(data => kind === data.kind)
         if (!typeTask)
           {
             console.log('kind'+kind+'non presente')
             //crealo con await su dataprovider
            const task = await dataProvider.create('tasks', { data: {
              "project": record?.project,
              "kind": kind,
              "spec": {
                  "function": `${record?.kind}://${record?.project}/${record?.name}:${record?.id}`
              }
          } });
              //  .then(response => console.log(response))
             //array locale
             if (task)
             {
              mapTask[kind]=typeTask;
            }
           }
           else {
             console.log('kind'+kind+' presente'+ JSON.stringify(data))
             mapTask[kind]=typeTask;
            }
           
       });
       //setTask con array locale + task esistenti in data. Uso mappa per tipo {profile: {...}, validate: {{}}}
       setTasks(mapTask);
     }
    },[dataProvider, data, isLoading]);
    if (isLoading) { return <></>; }
    if (error) { return <p>ERROR</p>; }
    if (!record || !tasks) return <></>;
  //record = function
  //data = task for that function
  //get type of tasks by kind in array format like ["profile", "validate", "metric", "infer"]
  


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
      {getTaskByFunction(record?.kind).map((item, index) => (
        <TabbedShowLayout.Tab label={item} key={index}>
          {/* {tasks['transform']} */}
          {/* switchare a componente che prende il record del task come parametro (tipo funzione?) */}
          {/* passo task per tipo */}
            {/* {Object.keys(tasks).forEach((value) => { */}
            <div>
              {/* {item} */}
              <RecordContextProvider value={tasks[item]}>
              <TaskAndRun  key={item.id}/>
              </RecordContextProvider>
              {/* {tasks[item]} */}
            </div>
            {/* // <TaskAndRun record={tasks.get(key)}  key={key}/>
        //   })
        // }  */}
        </TabbedShowLayout.Tab>
      ))}
    </TabbedShowLayout>
  );
};

export const FunctionShow = () => {
  return (
    <ShowBase>
      <>
        <ShowPageTitle />
        <ShowView
          actions={<PostShowActions />}
          aside={<VersionsList showActions={false} />}
          sx={{ "& .RaShow-card": { width: "50%" } }}
        >
          <FunctionShowLayout />
        </ShowView>
      </>
    </ShowBase>
  );
};
