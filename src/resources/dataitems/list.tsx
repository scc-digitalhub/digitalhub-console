import {
  Datagrid,
  EditButton,
  List,
  ShowButton,
  TextField,
} from "react-admin";
import yamlExporter from '@dslab/ra-export-yaml';
import { DeleteWithConfirmButtonShowingName } from "../../components/helper";

export const DataItemList = () => (
  <List exporter={yamlExporter}>
    <Datagrid rowClick="show">
      <TextField source="name" />
      <TextField source="kind" />
      <ShowButton />
      <EditButton />
      <DeleteWithConfirmButtonShowingName />
    </Datagrid>
  </List>
);
