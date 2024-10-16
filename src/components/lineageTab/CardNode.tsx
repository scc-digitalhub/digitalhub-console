import { memo, useState } from 'react';
import { Handle, NodeToolbar, Position, useEdges } from '@xyflow/react';
import {
    Card,
    CardHeader,
    alpha,
    CardContent,
    Stack,
    Chip,
    CardActionArea,
    styled,
    Typography,
} from '@mui/material';
import {
    DateField,
    FunctionField,
    IconButtonWithTooltip,
    Labeled,
    RecordContextProvider,
    TextField,
    useCreatePath,
    useGetOne,
    useGetRecordRepresentation,
} from 'react-admin';
import { useNavigate } from 'react-router-dom';
import { ArtifactIcon } from '../../resources/artifacts/icon';
import { ModelIcon } from '../../resources/models/icon';
import { DataItemIcon } from '../../resources/dataitems/icon';
import { RunIcon } from '../../resources/runs/icon';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { NODE_WIDTH } from './layouting';
import ClearIcon from '@mui/icons-material/Clear';
import { StateChips } from '../StateChips';
import AddIcon from '@mui/icons-material/Add';

/**
 * Run key: store://prj1/run/python+run/cee60681-54a9-49b8-a69a-59ee079148a9
 * Other keys: store://prj1/model/model/testm1:4b32d511-b0bc-450a-bbdb-01b781d323c7
 */
const parseKey = (key: string) => {
    const [store, emptyStr, project, resource, kind, nameAndId] =
        key.split('/');
    const [nameOrId, id] = nameAndId.split(':');
    return {
        resource: resource + 's',
        kind,
        name: nameOrId,
        id: id || nameOrId,
    };
};

export const CardNode = memo(function CardNode(props: {
    data: any;
    isConnectable: boolean;
}) {
    const [showInfo, setShowInfo] = useState(false);
    const { data } = props;
    const { resource, kind, name, id } = parseKey(data.key);
    const { data: record, error } = useGetOne(resource, { id });
    const recordRepresentation = useGetRecordRepresentation(resource);

    let nodeClass = data?.current ? 'MeNode' : 'RegularNode';
    if (showInfo) {
        nodeClass += ' InfoOpen';
    }

    const handleNodeClick = e => {
        setShowInfo(!showInfo);
        e.stopPropagation();
    };

    const closeInfo = () => {
        setShowInfo(false);
    };

    const nodeContent =
        resource == 'runs' ? (
            <CardContent sx={{ padding: '0 0 8px 0 !important' }}>
                <Stack>
                    <RunIcon sx={{ alignSelf: 'center' }} />
                    <Typography
                        component={'span'}
                        variant="body2"
                        sx={{ textAlign: 'center' }}
                    >
                        {'#' + recordRepresentation(record)}
                    </Typography>
                    <Typography
                        component={'span'}
                        variant="body2"
                        sx={theme => ({
                            textAlign: 'center',
                            color: alpha(theme.palette.common.black, 0.6),
                        })}
                    >
                        {kind}
                    </Typography>
                </Stack>
            </CardContent>
        ) : (
            <CardHeader
                avatar={icons[resource]}
                title={'#' + name}
                subheader={kind}
            />
        );

    const clickableNode = data?.current ? (
        nodeContent
    ) : (
        <CardActionArea onClick={handleNodeClick}>{nodeContent}</CardActionArea>
    );

    const edges = useEdges();
    const isLeftHandleClickable = !edges.some(e => e.target == id);
    const isRightHandleClickable = !edges.some(e => e.source == id);

    const leftPlusHandleStyle = {
        left: -20,
        background: '#555',
        minWidth: 20,
        height: 20,
        borderRadius: 4,
        placeItems: 'center',
        display: 'grid',
        color: '#fff',
        zIndex: 2,
    };

    const rightPlusHandleStyle = {
        right: -20,
        background: '#555',
        minWidth: 20,
        height: 20,
        borderRadius: 4,
        placeItems: 'center',
        display: 'grid',
        color: '#fff',
        zIndex: 2,
    };

    return (
        <>
            <Handle
                type="target"
                id={`${resource}:${id}:target`}
                position={Position.Left}
                isConnectableStart={isLeftHandleClickable}
                style={isLeftHandleClickable ? leftPlusHandleStyle : {}}
            >
                {isLeftHandleClickable && (
                    <AddIcon
                        style={{ width: 12, height: 12, pointerEvents: 'none' }}
                    />
                )}
            </Handle>
            {resource == 'runs' ? (
                <RoundNode elevation={0} className={nodeClass}>
                    {clickableNode}
                </RoundNode>
            ) : (
                <SquareNode elevation={0} className={nodeClass}>
                    {clickableNode}
                </SquareNode>
            )}
            {showInfo && (
                <NodeInfo
                    resource={resource}
                    record={record}
                    error={error}
                    close={closeInfo}
                />
            )}
            <Handle
                type="source"
                id={`${resource}:${id}:source`}
                position={Position.Right}
                isConnectableStart={isRightHandleClickable}
                style={isRightHandleClickable ? rightPlusHandleStyle : {}}
            >
                {isRightHandleClickable && (
                    <AddIcon
                        style={{ width: 12, height: 12, pointerEvents: 'none' }}
                    />
                )}
            </Handle>
        </>
    );
});

const NodeInfo = (props: {
    resource: string;
    record: any;
    error: any;
    close: () => void;
}) => {
    const { resource, record, error, close } = props;
    const createPath = useCreatePath();
    const navigate = useNavigate();
    const recordRepresentation = useGetRecordRepresentation(resource);

    if (error) {
        //TODO something more useful
        return (
            <NodeToolbar isVisible position={Position.Bottom}>
                {error}
            </NodeToolbar>
        );
    }

    const toShow = () => {
        const path = createPath({
            resource,
            id: record.id,
            type: 'show',
        });

        navigate(path);
    };

    const headerActions = (
        <>
            <IconButtonWithTooltip
                label="ra.action.show"
                color="primary"
                onClick={toShow}
            >
                <OpenInNewIcon fontSize="small" />
            </IconButtonWithTooltip>
            <IconButtonWithTooltip
                label={'ra.action.delete'}
                color="primary"
                onClick={close}
            >
                <ClearIcon fontSize="small" />
            </IconButtonWithTooltip>
        </>
    );

    return (
        <NodeToolbar isVisible position={Position.Bottom}>
            {record && (
                <RecordContextProvider value={record}>
                    <Card elevation={4}>
                        <CardHeader
                            title={
                                resource === 'runs'
                                    ? '#' + recordRepresentation(record)
                                    : '#' + record.name
                            }
                            titleTypographyProps={{ variant: 'h6' }}
                            subheader={record.kind}
                            subheaderTypographyProps={{ variant: 'body2' }}
                            action={headerActions}
                        />
                        <CardContent sx={{ pt: 0, pb: '16px !important' }}>
                            <Stack
                                sx={{
                                    maxWidth: NODE_WIDTH * 2,
                                    '& .RaChipField-chip': {
                                        width: 'fit-content',
                                    },
                                }}
                            >
                                {record.metadata.version ? (
                                    <Labeled>
                                        <TextField
                                            source="metadata.version"
                                            label="fields.metadata.version"
                                        />
                                    </Labeled>
                                ) : (
                                    <Labeled>
                                        <TextField
                                            source="id"
                                            label="fields.id"
                                        />
                                    </Labeled>
                                )}
                                <Labeled>
                                    <DateField
                                        showTime
                                        source="metadata.updated"
                                        label="fields.updated.title"
                                    />
                                </Labeled>
                                <Labeled>
                                    <TextField
                                        source="user"
                                        label="fields.user.title"
                                    />
                                </Labeled>
                                {resource == 'runs' && (
                                    <Labeled label="fields.status.state">
                                        <StateChips source="status.state" />
                                    </Labeled>
                                )}
                                {record.metadata.labels && (
                                    <Labeled>
                                        <FunctionField
                                            source="metadata.labels"
                                            label="fields.labels.title"
                                            render={record =>
                                                record.metadata.labels.map(
                                                    label => (
                                                        <Chip
                                                            key={label}
                                                            label={label}
                                                            sx={{
                                                                mr: '5px',
                                                                mt: '5px',
                                                            }}
                                                        ></Chip>
                                                    )
                                                )
                                            }
                                        />
                                    </Labeled>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>
                </RecordContextProvider>
            )}
        </NodeToolbar>
    );
};

const icons = {
    artifacts: <ArtifactIcon />,
    models: <ModelIcon />,
    dataitems: <DataItemIcon />,
};

// const PlusHandle = styled(Handle, {
//     name: 'PlusHandle',
//     overridesResolver: (_props, styles) => styles.root,
// })(({ theme, className }) => ({
//     backgroundColor: 'green', width: '10px', height: '14px', borderRadius: '3px',
//     // lineHeight: 20,
//     left: -10,
//     content: '"+"',
//     ['&::after']: { content: '"+"', display: 'table-cell', verticalAlign: 'middle' }
// }));

const Node = styled(Card, {
    name: 'Node',
    overridesResolver: (_props, styles) => styles.root,
})(({ theme, className }) => ({
    border: 'solid 1px #ccc',
    backgroundColor: className?.includes('MeNode')
        ? alpha(theme.palette?.primary?.main, 0.12)
        : className?.includes('InfoOpen')
        ? '#D1F0CA'
        : 'white',
    ...theme.applyStyles('dark', {
        backgroundColor: className?.includes('MeNode')
            ? alpha(theme.palette?.primary?.main, 0.12)
            : className?.includes('InfoOpen')
            ? '#47763C'
            : 'black',
    }),
    ['& .MuiCardHeader-avatar']: { marginRight: '8px' },
    ['& .MuiCardHeader-root']: { padding: '8px' },
    ['& .RaLabeled-label']: { fontSize: '0.6em' },
}));

const SquareNode = styled(Node, {
    name: 'SquareNode',
    overridesResolver: (_props, styles) => styles.root,
})(() => ({}));

const RoundNode = styled(Node, {
    name: 'SquareNode',
    overridesResolver: (_props, styles) => styles.root,
})(() => ({
    borderRadius: '100%',
    aspectRatio: 1 / 1,
    ['& .MuiCardActionArea-root']: {
        width: '100%',
        height: '100%',
        padding: '10px',
    },
}));
