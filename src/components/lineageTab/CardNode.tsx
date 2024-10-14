import { memo, useState } from 'react';
import { Handle, NodeToolbar, Position } from '@xyflow/react';
import {
    Card,
    CardHeader,
    alpha,
    CardContent,
    Stack,
    Chip,
    CardActionArea,
    styled,
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

    const nodeContent = (
        <CardHeader
            avatar={icons[resource]}
            title={
                resource == 'runs'
                    ? '#' + recordRepresentation(record)
                    : '#' + name
            }
            subheader={kind}
        />
    );

    const clickableNode = data?.current ? (
        nodeContent
    ) : (
        <CardActionArea onClick={handleNodeClick}>{nodeContent}</CardActionArea>
    );

    return (
        <>
            <Handle
                type="target"
                position={Position.Left}
                style={{ background: '#555' }}
            />
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
                position={Position.Right}
                style={{ background: '#555' }}
            />
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
    runs: <RunIcon />,
};

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
    ['& .MuiTypography-caption']: { fontSize: '0.7em' },
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
    display: 'flex',
    justifyContent: 'center',
}));
