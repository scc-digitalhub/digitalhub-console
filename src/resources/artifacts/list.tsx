import {
    Datagrid,
    EditButton,
    List,
    ShowButton,
    TextField,
    useRecordContext,
} from 'react-admin';
import yamlExporter from '@dslab/ra-export-yaml';
import { DeleteWithConfirmButtonShowingName } from '../../components/helper';

const ListVersion = () => {
  const record = useRecordContext();
  return (
      <div > Metto le versioni {record.name} </div>
  );
};
export const ArtifactList = () => {
  return (
    <List exporter={yamlExporter}>
    <Datagrid rowClick="show" expand={<ListVersion />}>
      <TextField source="name" />
      <TextField source="kind" />
      <ShowButton />
      <EditButton />
      <DeleteWithConfirmButtonShowingName />
    </Datagrid>
  </List>
)};