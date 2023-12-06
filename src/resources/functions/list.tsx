import {
  Datagrid,
  EditButton,
  List,
  ShowButton,
  TextField,
} from "react-admin";
import yamlExporter from "@dslab/ra-export-yaml";
import { DeleteWithConfirmButtonShowingName, ListVersion } from "../../components/helper";



export const FunctionList = () => (
  <List exporter={yamlExporter}>
    <Datagrid rowClick="show" expand={ListVersion}>
      <TextField source="name" />
      <TextField source="kind" />
      <ShowButton />
      <EditButton />
      <DeleteWithConfirmButtonShowingName />
    </Datagrid>
  </List>
);
