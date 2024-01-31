import {
  Edit,
  RecordContextProvider,
  SimpleForm,
  TextField,
  useRecordContext,
} from "react-admin";
import { JsonSchemaInput } from "@dslab/ra-jsonschema-input";
import { TaskToolbar } from "../../components/helper";
import { TaskSchema } from "./types";

export interface TaskProp {
  record?: any;
}

//prendere props dall'esterno, incluse le opzioni <TaskEdit queryOption={query options come function=dbt://prj1/funct2:2de05c83-4831-46a7-8929-9264e6889185}>
/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling
export const TaskEdit = () => {
  const recordProp = useRecordContext();
  const kind = recordProp?.kind || undefined;
  // const recordContext = useRecordContext();

  console.log(kind);
  return (
    <Edit >
      <RecordContextProvider value={recordProp}>
        <SimpleForm toolbar={<TaskToolbar />}>
          <TextField source="kind"></TextField>
          <JsonSchemaInput source="spec" schema={TaskSchema} />
        </SimpleForm>
      </RecordContextProvider>
    </Edit>
  );
};
