import {
    useDataProvider,
    useGetList,
    useRecordContext,
    useRefresh,
    useTranslate,
} from 'react-admin';
import {
    List as MuiList,
    ListItem,
    Button,
    ListItemText,
    Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export const RunList = () => {
    const taskRecordProp = useRecordContext();
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const refresh = useRefresh();
    const { data, total, isLoading, error } = useGetList('runs', {
        filter: { task_id: `${taskRecordProp?.id}` },
    });
    const handleClick = () => {
        dataProvider
            .create('runs', {
                data: {
                    project: taskRecordProp?.project,
                    kind: 'run',
                    spec: {
                        local_execution: false,
                        task: `${
                            taskRecordProp.spec.function.split('://')[0]
                        }+${taskRecordProp.kind}://${
                            taskRecordProp.spec.function.split('://')[1]
                        }`,
                        task_id: taskRecordProp?.id,
                    },
                },
            })
            .then(() => {
                //after creation
                refresh();
            });
    };

    if (isLoading) {
        return <p> Loading...</p>;
    }
    if (error) {
        return <p>ERROR</p>;
    }
    return (
        <>
            <h1>Runs</h1>
            <MuiList>
                {data?.map(run => (
                    <div key={run.id}>
                        <ListItem disablePadding>
                            <ListItemText>{run.id}</ListItemText>
                            <ListItemText>{run.spec?.task}</ListItemText>
                            <ListItemText>{run.status?.state}</ListItemText>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </div>
                ))}
            </MuiList>
            <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleClick}
            >
                {translate('resources.runs.create')}
            </Button>
            <p>
                {total} {translate('resources.runs.total')}
            </p>
        </>
    );
};
