import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
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
import { NODE_WIDTH } from './layouting';

/**
 * Run key: store://prj1/run/python+run/cee60681-54a9-49b8-a69a-59ee079148a9
 * Other keys: store://prj1/model/model/testm1:4b32d511-b0bc-450a-bbdb-01b781d323c7
 */
const parseKey = (key: string) => {
    const [store, emptyStr, project, resource, kind, nameAndId] = key.split('/');
    const [name, id] = nameAndId.split(':');
    return { resource: resource + 's', kind, name, id: id || name };
};

// const calculateLabelWidth = () => {
//     const width = (NODE_WIDTH - 50) / 2;
//     return width + 'px';
// };

export const CardNode = memo(function CardNode(props: {
    data: any;
    isConnectable: boolean;
}) {
    const navigate = useNavigate();
    const createPath = useCreatePath();
    const { data } = props;
    const { resource, kind, name, id } = parseKey(data.key);
    // const { data: record, isLoading, error } = useGetOne(resource, { id });

    const handleCardClick = e => {
        const path = createPath({
            resource,
            id,
            type: 'show',
        });

        navigate(path);
        e.stopPropagation();
    };

    // const innerCard = (
    //     <>
    //         <CardHeader
    //             avatar={icons[resource]}
    //             title={'#' + name}
    //             subheader={kind}
    //         />
    //         <CardContent sx={{ p: '8px' }}>
    //             {record && (
    //                 <RecordContextProvider value={record}>
    //                     {!data?.current && (
    //                         <Stack sx={{ color: 'text.secondary' }}>
    //                             <Labeled>
    //                                 <DateField
    //                                     showTime
    //                                     source="metadata.updated"
    //                                     label="fields.updated.title"
    //                                     variant="caption"
    //                                 />
    //                             </Labeled>
    //                         </Stack>
    //                     )}
    //                     <Stack direction={'row'}>
    //                         {record.metadata.labels
    //                             ?.slice(0, 3)
    //                             .map((label, index) => {
    //                                 if (index < 2) {
    //                                     return (
    //                                         <Chip
    //                                             key={label}
    //                                             label={label}
    //                                             sx={{
    //                                                 mr:
    //                                                     index === 0
    //                                                         ? '5px'
    //                                                         : '0',
    //                                                 mb: '8px',
    //                                                 fontSize: 'xx-small',
    //                                                 maxWidth:
    //                                                     calculateLabelWidth(),
    //                                                 overflow: 'hidden',
    //                                                 textOverflow: 'ellipsis',
    //                                             }}
    //                                             size="small"
    //                                         ></Chip>
    //                                     );
    //                                 } else {
    //                                     return <span key={index}>...</span>;
    //                                 }
    //                             })}
    //                     </Stack>
    //                 </RecordContextProvider>
    //             )}
    //         </CardContent>
    //     </>
    // );

    return (
        <>
            <Handle
                type="target"
                position={Position.Left}
                style={{ background: '#555' }}
            />
            {resource == 'runs' ? (
                <RoundNode
                    elevation={0}
                    className={data?.current ? 'MeNode' : 'RegularNode'}
                >
                    {data?.current ? (
                        <CardHeader
                            avatar={icons[resource]}
                            title={kind}
                        />
                    ) : (
                        <CardActionArea onClick={handleCardClick}>
                            <CardHeader
                                avatar={icons[resource]}
                                title={kind}
                            />
                        </CardActionArea>
                    )}
                </RoundNode>
            ) : (
                <SquareNode
                    elevation={0}
                    className={data?.current ? 'MeNode' : 'RegularNode'}
                >
                    {data?.current ? (
                        <CardHeader
                            avatar={icons[resource]}
                            title={'#' + name}
                            subheader={kind}
                        />
                    ) : (
                        <CardActionArea onClick={handleCardClick}>
                            <CardHeader
                                avatar={icons[resource]}
                                title={'#' + name}
                                subheader={kind}
                            />
                        </CardActionArea>
                    )}
                </SquareNode>
            )}
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

const Node = styled(Card, {
    name: 'Node',
    overridesResolver: (_props, styles) => styles.root,
})(({ theme, className }) => ({
    border: 'solid 1px #ccc',
    backgroundColor:
        className == 'MeNode'
            ? alpha(theme.palette?.primary?.main, 0.12)
            : 'white',
    ...theme.applyStyles('dark', {
        backgroundColor:
            className == 'MeNode'
                ? alpha(theme.palette?.primary?.main, 0.12)
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
})(({ theme, className }) => ({}));

const RoundNode = styled(Node, {
    name: 'SquareNode',
    overridesResolver: (_props, styles) => styles.root,
})(({ theme, className }) => ({
    borderRadius: '100%',
    aspectRatio: 1 / 1,
    display: 'flex',
    justifyContent: 'center',
}));
