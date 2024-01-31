import {
  useGetList,
  useRecordContext,
} from "react-admin";
import { Card, CardContent } from '@mui/material';

export const RunList = () => {
  const recordProp = useRecordContext();

  // const translate = useTranslate();
  const { data, total, isLoading, error } = useGetList(
    'runs',
    {
        filter: {task_id:`${recordProp?.id}`},
    }
    );
    if (isLoading) { return <p> Loading...</p>; }
    if (error) { return <p>ERROR</p>; }
    return (
        <>
            <h1>Runs</h1>
            <ul>
                {/* TypeScript knows that posts is of type Post[] */}
                {data?.map(run =>
                    <Card key={run.id}>
                      <CardContent>
                      <p>{run.id}</p>
                    <p>{run.spec?.task}</p>
                    <p>{run.status?.state}</p>
                    </CardContent>
                    </Card>
                    )}
            </ul>
            <p>{data?.length} / {total} run</p>
        </>
    );
                }
;