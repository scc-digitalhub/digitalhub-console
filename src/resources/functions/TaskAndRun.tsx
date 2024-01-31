import { TaskEdit } from "../tasks";
import { RunList } from "../runs";
import { RecordContextProvider, useRecordContext } from "react-admin";

export const TaskAndRun = () => {
  const recordProp = useRecordContext();
  const kind = recordProp?.kind || undefined;
  console.log(kind);
  return (
    <div>
      <RecordContextProvider value={recordProp}>
        <TaskEdit />
        <RunList />
      </RecordContextProvider>
    </div>
  );
};
