import {
  Datagrid,
  EditButton,
  List,
  SelectInput,
  ShowButton,
  TextField,
  TextInput,
  useTranslate,
} from "react-admin";
import yamlExporter from "@dslab/ra-export-yaml";
import {
  DeleteWithConfirmButtonShowingName,
  ListVersion,
} from "../../components/helper";
import { DataItemTypes } from "./types";

const kinds = Object.values(DataItemTypes).map((v) => {
  return {
    id: v,
    name: v,
  };
});
export const DataItemList = () => {
  const translate = useTranslate();
  const postFilters = [
    <TextInput
      label={translate("search.name")}
      source="name"
      alwaysOn
      key={1}
    />,
    <SelectInput alwaysOn key={2} source="kind" choices={kinds} />,
  ];
  return (
    <List exporter={yamlExporter} filters={postFilters}>
      <Datagrid rowClick="show" expand={ListVersion}>
        <TextField source="name" />
        <TextField source="kind" />
        <div style={{ display: "flex", justifyContent: "end" }}>
          <ShowButton />
          <EditButton />
          <DeleteWithConfirmButtonShowingName />
        </div>
      </Datagrid>
    </List>
  );
};
