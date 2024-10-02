import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import {
    Card,
    CardHeader,
    CardContent,
    Typography,
    CardActions,
} from '@mui/material';
import { Resource, ShowButton, useCreatePath } from 'react-admin';
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
    const type = resourceSplitted.pop();
    const resource = resourceSplitted.pop() + 's';
    return { resource, type, id, name };
};
export const CardNode = memo(function CardNode(props: {
    data: any;
    isConnectable: boolean;
}) {
    const navigate = useNavigate();
    const createPath = useCreatePath();
    const { data } = props;
    const { resource, id, name } = parseKey(data.key);
    const onShow = () => {
        const path = createPath({
            resource,
            id,
            type: 'show',
        });

        //navigate
        navigate(path);
    };
    //identificare l'icona da data.key
    //prendere name da ky
    //prendere id da ky
    return (
        <>
            <Handle
                type="target"
                position={Position.Left}
                style={{ background: '#555' }}
            />
            <Card elevation={0}  sx={{ border: 'solid 1px #ccc' }}>
                <CardHeader
                    avatar={icons[resource]}
                    title={name}
                    // subheader={
                    //     id
                    // }
                />
                {/* <CardContent>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {content}
        </Typography>
    </CardContent> */}
                <CardActions disableSpacing>
                    {data?.showButton && (
                        <ShowButton
                            resource={resource}
                            variant="text"
                            color="info"
                            record={{ id }}
                            onClick={e => onShow()}
                        />
                    )}
                </CardActions>
            </Card>
            <Handle
                type="source"
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
