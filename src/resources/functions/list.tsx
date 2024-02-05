import {
  Datagrid,
  DateField,
  EditButton,
  ListBase,
  ListView,
  SelectInput,
  ShowButton,
  TextField,
  TextInput,
  useTranslate,
} from "react-admin";
import yamlExporter from "@dslab/ra-export-yaml";
import { DeleteWithConfirmButtonShowingName } from "../../components/helper";
import { FunctionTypes } from "./types";
import { ListPageTitle } from "../../components/pageTitle";
import { FunctionIcon } from "./icon";
import { VersionsList } from "../../components/versionsList";

const kinds = Object.values(FunctionTypes).map((v) => {
  return {
    id: v,
    name: v,
  };
});

export const FunctionList = () => {
  const translate = useTranslate();
  const postFilters = [
    <TextInput
      label={translate("search.name")}
      source="name"
      alwaysOn
      key={1}
    />,
    <SelectInput
      alwaysOn
      key={2}
      source="kind"
      choices={kinds}
      sx={{ "& .RaSelectInput-input": { margin: "0px" } }}
    />,
  ];
  return (
    <ListBase exporter={yamlExporter}>
      <>
        <ListPageTitle icon={<FunctionIcon fontSize={"large"} />} />
        <ListView filters={postFilters}>
          <Datagrid
            rowClick="show"
            expand={<VersionsList />}
            expandSingle={true}
          >
            <TextField source="name" />
            <TextField source="kind" />
            <DateField
              source="metadata.updated"
              showDate={true}
              showTime={true}
            />
            <div style={{ display: "flex", justifyContent: "end" }}>
              <ShowButton />
              <EditButton />
              <DeleteWithConfirmButtonShowingName />
            </div>
          </Datagrid>
        </ListView>
      </>
    </ListBase>
  );
};
