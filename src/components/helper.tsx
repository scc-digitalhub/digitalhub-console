import { DeleteWithConfirmButton, useRecordContext } from "react-admin";

export const RecordTitle = ({ prompt}:any) => {
  const record = useRecordContext();
  return <span>{prompt} {record ? `${record.name}` : ""}</span>;
};

export const DeleteWithConfirmButtonShowingName = () => {
  const record = useRecordContext();
  return <DeleteWithConfirmButton  translateOptions={{ id: record.name }}/>;
}
