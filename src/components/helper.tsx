import { Button, ButtonProps, DeleteWithConfirmButton, EditButton, RaRecord, SaveButton, ShowButton, Toolbar, TopToolbar, useDataProvider, useRecordContext, useResourceContext, useTranslate } from "react-admin";
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { useNavigate } from 'react-router-dom';
import { BackButton } from "@dslab/ra-back-button";
import { ExportRecordButton } from "@dslab/ra-export-record-button";
import { InspectButton } from "@dslab/ra-inspect-button";
import { useRootSelector } from "@dslab/ra-root-selector";
import { useState, useEffect } from "react";
import { TableCell,TableHead,  TableRow,TableBody,Table } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

export const RecordTitle = ({ prompt}:any) => {
  const record = useRecordContext();
  return <span>{prompt} {record ? `${record.name}` : ""}</span>;
};

export const DeleteWithConfirmButtonShowingName = () => {
  const record = useRecordContext();
  if (!record)
    return <></>
  return <DeleteWithConfirmButton  translateOptions={{ id: record.name }}/>;
}
export const NewVersionButton = (props: ButtonProps) => {
  const navigate = useNavigate();
  const { label = 'buttons.newVersion', ...rest } = props;
  return (
      <Button label={label} onClick={() => navigate('update')} {...rest}>
          <FileCopyIcon />
      </Button>
  );
};

export const PostShowActions = () => (
  <TopToolbar>
    <BackButton />
    <EditButton style={{ marginLeft: "auto" }} />
    <InspectButton />
    <ExportRecordButton language="yaml" />
    <DeleteWithConfirmButtonShowingName />
  </TopToolbar>
);

export const ListVersion = () => {
  const record = useRecordContext();
  const resource = useResourceContext();
  const dataProvider = useDataProvider();
  const { root } = useRootSelector();
  const translate =useTranslate();
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
            <TableCell  align="center">{translate("resources.list.expandable.version")}</TableCell>
            <TableCell align="center">{translate("resources.list.expandable.created")}</TableCell>
            <TableCell ></TableCell>
          </TableRow>
        </TableHead>
    <TableBody>
      {versions.map(item => (
        <TableRow key={item.id}>
          <TableCell component="th" scope="row" align="center">{item.metadata?.version}</TableCell>
          <TableCell align="center">{item.metadata?.created}</TableCell>
          <TableCell size="small" align="right"><ShowButton record={item}/></TableCell>
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
