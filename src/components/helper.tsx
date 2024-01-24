import {
  Button,
  ButtonProps,
  Datagrid,
  DateField,
  DeleteWithConfirmButton,
  EditButton,
  List,
  ListBase,
  Pagination,
  RaRecord,
  SaveButton,
  ShowButton,
  TextField,
  Toolbar,
  TopToolbar,
  useDataProvider,
  useRecordContext,
  useResourceContext,
  useTranslate,
} from "react-admin";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { useNavigate } from "react-router-dom";
import { BackButton } from "@dslab/ra-back-button";
import { ExportRecordButton } from "@dslab/ra-export-record-button";
import { InspectButton } from "@dslab/ra-inspect-button";
import { useRootSelector } from "@dslab/ra-root-selector";
import { useState, useEffect, memo } from "react";
import {
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Table,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { Card } from "@mui/material";

export const RecordTitle = ({ prompt }: any) => {
  const record = useRecordContext();
  return (
    <span>
      {prompt} {record ? `${record.name}` : ""}
    </span>
  );
};

export const DeleteWithConfirmButtonShowingName = () => {
  const record = useRecordContext();
  if (!record) return <></>;
  return <DeleteWithConfirmButton translateOptions={{ id: record.name }} />;
};

export const NewVersionButton = (props: ButtonProps) => {
  const navigate = useNavigate();
  const { label = "buttons.newVersion", ...rest } = props;
  return (
    <Button label={label} onClick={() => navigate("update")} {...rest}>
      <FileCopyIcon />
    </Button>
  );
};

export const PostShowActions = () => {
  const record = useRecordContext();
  return <ShowToolbar record={record} />;
};

const arePropsEqual = (oldProps: any, newProps: any) => {
  if (!newProps.record) return true;
  return Object.is(oldProps.record, newProps.record);
};

const ShowToolbar = memo(function ShowToolbar(props: { record: any }) {
  if (!props.record) return <></>;
  return (
    <TopToolbar>
      <BackButton />
      <EditButton style={{ marginLeft: "auto" }} record={props.record} />
      <InspectButton record={props.record} />
      <ExportRecordButton language="yaml" record={props.record} />
      <DeleteWithConfirmButton
        translateOptions={{ id: props.record.name }}
        record={props.record}
      />
    </TopToolbar>
  );
}, arePropsEqual);

export const ListVersion = () => {
  const record = useRecordContext();
  const resource = useResourceContext();
  const dataProvider = useDataProvider();
  const { root } = useRootSelector();
  const translate = useTranslate();
  const [versions, setVersions] = useState<RaRecord>();

  useEffect(() => {
    if (dataProvider) {
      dataProvider.getLatest(resource, { record, root }).then((versions) => {
        setVersions(versions.data);
      });
    }
  }, [dataProvider, record, resource]);

  if (!versions || !record || !dataProvider) return <></>;
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align="center">
            {translate("resources.list.expandable.version")}
          </TableCell>
          <TableCell align="center">
            {translate("resources.list.expandable.created")}
          </TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {versions.map((item) => (
          <TableRow key={item.id}>
            <TableCell component="th" scope="row" align="center">
              {item.metadata?.version}
            </TableCell>
            <TableCell align="center">
              <DateField source="created" record={item.metadata} />
            </TableCell>
            <TableCell size="small" align="right">
              <ShowButton record={item} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export const PostEditToolbar = () => {
  const translate = useTranslate();
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(-1);
  };
  return (
    <Toolbar>
      <SaveButton />
      <Button
        color="info"
        label={translate("buttons.cancel")}
        onClick={handleClick}
      >
        <ClearIcon />
      </Button>
      <NewVersionButton />
    </Toolbar>
  );
};
export const TaskToolbar = () => {
  return (
    <Toolbar>
      <SaveButton />
    </Toolbar>
  );
};
const getStyle= (record:any) => {
  const curRecord = record || {};
  return {
    postRowSx: (record) => ({
      backgroundColor: record.id === curRecord?.id ? "aliceblue" : "white",
    }),
  };
};

export const Aside = () => {
  const record = useRecordContext();
  const dataProvider = useDataProvider();

  if (!dataProvider) return <></>;
  return <AsideList record={record} />;
};

const AsideList = memo(function AsideList(props: { record: any }) {
  if (!props.record) return <></>;
  return (
    <ListBase
      queryOptions={{ meta: { allVersion: true, record: props.record } }}
    >
      <div style={{ marginLeft: "2rem" }}>
        <Card>
          <Datagrid
            rowClick="show"
            rowSx={getStyle(props.record).postRowSx}
            bulkActionButtons={false}
          >
            <DateField
              source="metadata.created"
              label="resources.aside.created"
            />
            <TextField source="metadata.version" />
          </Datagrid>
        </Card>
        <Pagination />
      </div>
    </ListBase>
  );
}, arePropsEqual);

export const TaskComponent = () => {
  return <div>Json Scehma input</div>;
};
export const FunctionList = () => {
  const record = useRecordContext();
  const dataProvider = useDataProvider();
  if (!record || !record.metadata || !dataProvider) return <></>;
  return (
    <List>
      <Datagrid>
        <TextField source="id" />
        <TextField source="title" />
      </Datagrid>
    </List>
  );
};
