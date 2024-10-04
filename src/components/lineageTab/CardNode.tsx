import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardHeader, alpha, CardContent, Stack } from '@mui/material';
import {
    DateField,
    Labeled,
    RecordContextProvider,
    useCreatePath,
    useGetOne,
} from 'react-admin';
import { useNavigate } from 'react-router-dom';
import { ArtifactIcon } from '../../resources/artifacts/icon';
import { ModelIcon } from '../../resources/models/icon';
import { DataItemIcon } from '../../resources/dataitems/icon';
import { RunIcon } from '../../resources/runs/icon';

// store://prj1/model/model/testm1:4b32d511-b0bc-450a-bbdb-01b781d323c7
const parseKey = (key: string) => {
    const [store, resourcePath, id] = key.split(':');
    const resourceSplitted = resourcePath.split('/');
    const name = resourceSplitted.pop();
    const kind = resourceSplitted.pop();
    const resource = resourceSplitted.pop() + 's';
    return { resource, kind, name, id };
};

export const CardNode = memo(function CardNode(props: {
    data: any;
    isConnectable: boolean;
}) {
    const navigate = useNavigate();
    const createPath = useCreatePath();
    const { data } = props;
    const { resource, kind, name, id } = parseKey(data.key);
    const { data: record, isLoading, error } = useGetOne(resource, { id });

    const onShow = () => {
        const path = createPath({
            resource,
            id,
            type: 'show',
        });

        navigate(path);
    };

    return (
        <>
            <Handle
                type="source"
                position={Position.Left}
                style={{ background: '#555' }}
            />
            <Card
                elevation={0}
                sx={theme => ({
                    border: 'solid 1px #ccc',
                    backgroundColor: data?.showButton
                        ? 'white'
                        : alpha(theme.palette?.primary?.main, 0.12),
                    '& .MuiCardHeader-avatar': { marginRight: '8px' },
                    '& .MuiCardHeader-root': { p: '8px' },
                    '& .MuiCardContent-root': { p: '0 8px 0 8px !important' },
                    '& .RaLabeled-label': { fontSize: '0.6em' },
                    '& .MuiTypography-caption': { fontSize: '0.7em' },
                })}
            >
                <CardHeader
                    avatar={icons[resource]}
                    title={'#' + name}
                    subheader={kind}
                />
                {data?.showButton && (
                    <CardContent sx={{ p: '8px' }}>
                        {record && (
                            <RecordContextProvider value={record}>
                                <Stack sx={{ color: 'text.secondary' }}>
                                    <Labeled>
                                        <DateField
                                            showTime
                                            source="metadata.updated"
                                            label="fields.updated.title"
                                            variant="caption"
                                        />
                                    </Labeled>
                                </Stack>
                            </RecordContextProvider>
                        )}
                    </CardContent>
                )}
                {/* {data?.showButton && (
                    <CardActions disableSpacing>
                        <ShowButton
                            resource={resource}
                            variant="text"
                            color="info"
                            record={{ id }}
                            onClick={() => onShow()}
                        />
                    </CardActions>
                )} */}
            </Card>
            <Handle
                type="target"
                position={Position.Right}
                style={{ background: '#555' }}
            />
        </>
    );
});

const icons = {
    artifacts: <ArtifactIcon />,
    models: <ModelIcon />,
    dataitems: <DataItemIcon />,
    runs: <RunIcon />,
};
