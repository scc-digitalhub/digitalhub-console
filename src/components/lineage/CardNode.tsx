// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { createElement, memo, useState } from 'react';
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
    useResourceDefinitions,
    useTheme,
} from 'react-admin';
import { useNavigate } from 'react-router-dom';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { NODE_WIDTH, RelationshipDirection } from './utils';
import ClearIcon from '@mui/icons-material/Clear';
import { StateChips } from '../StateChips';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { keyParser } from '../../common/helper';

const CardNode = (props: { data: any; direction: RelationshipDirection }) => {
    const { data, direction } = props;
    const { resource = '', kind, name, id = name } = keyParser(data.key);

    const [showInfo, setShowInfo] = useState(false);
    const { data: record, error } = useGetOne(resource, { id });
    const recordRepresentation = useGetRecordRepresentation(resource);
    const edges = useEdges();
    const [theme] = useTheme();
    const definitions = useResourceDefinitions();

    const handleNodeClick = e => {
        setShowInfo(!showInfo);
        e.stopPropagation();
    };

    const closeInfo = e => {
        setShowInfo(false);
        e.stopPropagation();
    };

    const nodeClass = showInfo ? 'RegularNode InfoOpen' : 'RegularNode';

    const nodeContent =
        resource == 'runs' ? (
            <CardContent>
                <Stack>
                    {createElement(definitions['runs'].icon, {
                        sx: { alignSelf: 'center' },
                    })}
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
                            ...theme.applyStyles('dark', {
                                color: alpha(theme.palette.common.white, 0.7),
                            }),
                        })}
                    >
                        {kind}
                    </Typography>
                </Stack>
            </CardContent>
        ) : (
            <CardHeader
                avatar={createElement(definitions[resource].icon)}
                title={'#' + name}
                subheader={kind}
            />
        );

    const clickableNode = (
        <CardActionArea onClick={handleNodeClick}>{nodeContent}</CardActionArea>
    );

    const node =
        resource == 'runs' ? (
            <RoundNode elevation={0} className={nodeClass}>
                {clickableNode}
            </RoundNode>
        ) : (
            <SquareNode elevation={0} className={nodeClass}>
                {clickableNode}
            </SquareNode>
        );

    // Manage handles:
    // - if generic node has no connections one one side, show clickable "plus" handle
    // - if generic node has expandable=false, hide handle

    const isLeftConnected = edges.some(e =>
        direction == RelationshipDirection.reverse
            ? e.target == id
            : e.source == id
    );
    const isRightConnected = edges.some(e =>
        direction == RelationshipDirection.reverse
            ? e.source == id
            : e.target == id
    );

    const isLeftHandleClickable =
        data?.expandable !== false && !isLeftConnected;
    const isRightHandleClickable =
        data?.expandable !== false && !isRightConnected;

    const hideLeftHandle = !isLeftConnected && !isLeftHandleClickable;
    const hideRightHandle = !isRightConnected && !isRightHandleClickable;

    const handleStyle = {
        background: theme === 'dark' ? 'black' : 'white',
        minWidth: 20,
        height: 20,
        placeItems: 'center',
        display: 'grid',
        zIndex: 2,
        border: 0,
    };

    const leftPlusHandleStyle = {
        left: -20,
        ...handleStyle,
    };

    const rightPlusHandleStyle = {
        right: -20,
        ...handleStyle,
    };

    return (
        <>
            {!hideLeftHandle && (
                <Handle
                    type={
                        direction == RelationshipDirection.reverse
                            ? 'target'
                            : 'source'
                    }
                    id={`${btoa(data.key)}:left`}
                    position={Position.Left}
                    isConnectableStart={isLeftHandleClickable}
                    style={isLeftHandleClickable ? leftPlusHandleStyle : {}}
                >
                    {isLeftHandleClickable && (
                        <AddCircleOutlineIcon
                            style={{
                                width: '100%',
                                height: '100%',
                                pointerEvents: 'none',
                            }}
                        />
                    )}
                </Handle>
            )}
            {node}
            {showInfo && (
                <NodeInfo
                    resource={resource}
                    record={record}
                    error={error}
                    close={closeInfo}
                />
            )}
            {!hideRightHandle && (
                <Handle
                    type={
                        direction == RelationshipDirection.forward
                            ? 'target'
                            : 'source'
                    }
                    id={`${btoa(data.key)}:right`}
                    position={Position.Right}
                    isConnectableStart={isRightHandleClickable}
                    style={isRightHandleClickable ? rightPlusHandleStyle : {}}
                >
                    {isRightHandleClickable && (
                        <AddCircleOutlineIcon
                            style={{
                                width: '100%',
                                height: '100%',
                                pointerEvents: 'none',
                            }}
                        />
                    )}
                </Handle>
            )}
        </>
    );
};

export const ForwardCardNode = memo(function n(props: { data: any }) {
    return CardNode({
        data: props.data,
        direction: RelationshipDirection.forward,
    });
});

export const ReverseCardNode = memo(function n(props: { data: any }) {
    return CardNode({
        data: props.data,
        direction: RelationshipDirection.reverse,
    });
});

const NodeInfo = (props: {
    resource: string;
    record: any;
    error: any;
    close: (e) => void;
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

    const toShow = e => {
        e.stopPropagation();
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
                label={'ra.action.close'}
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
                            subheader={record.kind}
                            slotProps={{
                                title: {
                                    variant: 'h6',
                                },
                                subheader: {
                                    variant: 'body2',
                                },
                            }}
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
})(({ className }) => ({
    borderRadius: '100%',
    aspectRatio: 1 / 1,
    ['& .MuiCardActionArea-root']: {
        width: '100%',
        height: '100%',
        padding: '10px',
    },
    ['& .MuiCardContent-root']: className?.includes('MeNode')
        ? {
              padding: '10px !important',
          }
        : {
              padding: '0 0 8px 0 !important',
          },
}));
