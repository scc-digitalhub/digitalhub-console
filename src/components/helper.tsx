import { BackButton } from '@dslab/ra-back-button';
import { ExportRecordButton } from '@dslab/ra-export-record-button';
import { InspectButton } from '@dslab/ra-inspect-button';
import { useRootSelector } from '@dslab/ra-root-selector';
import ClearIcon from '@mui/icons-material/Clear';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import {
    Card,
    CardContent,
    CardHeader,
    Table as MaterialTable,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';
import { ReactNode, memo, useEffect, useState } from 'react';
import {
    Button,
    ButtonProps,
    Datagrid,
    DateField,
    DeleteWithConfirmButton,
    EditButton,
    List,
    RaRecord,
    SaveButton,
    ShowButton,
    TextField,
    Toolbar,
    TopToolbar,
    useDataProvider,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { useNavigate } from 'react-router-dom';
import { arePropsEqual } from '../common/helper';
import { VersionsList } from './VersionsList';

export const RecordTitle = ({ prompt }: any) => {
    const record = useRecordContext();
    return (
        <span>
            {prompt} {record ? `${record.name}` : ''}
        </span>
    );
};

export const DeleteWithConfirmButtonShowingName = () => {
    const record = useRecordContext();
    if (!record) return <></>;
    return <DeleteWithConfirmButton translateOptions={{ id: record.name }} />;
};

export const NewVersionButton = (props: ButtonProps) => {
    const navigate = useNavigate();
    const { label = 'buttons.newVersion', ...rest } = props;
    return (
        <Button label={label} onClick={() => navigate('update')} {...rest}>
            <FileCopyIcon />
        </Button>
    );
};

export const PostShowActions = () => {
    const record = useRecordContext();
    return <ShowToolbar record={record} />;
};

const ShowToolbar = memo(function ShowToolbar(props: { record: any }) {
    if (!props.record) return <></>;
    return (
        <TopToolbar>
            <BackButton />
            <EditButton style={{ marginLeft: 'auto' }} record={props.record} />
            <InspectButton record={props.record} />
            <ExportRecordButton language="yaml" record={props.record} />
            <DeleteWithConfirmButton
                translateOptions={{ id: props.record.name }}
                record={props.record}
            />
        </TopToolbar>
    );
}, arePropsEqual);

export const ListVersion = () => {
    const record = useRecordContext();
    const resource = useResourceContext();
    const dataProvider = useDataProvider();
    const { root } = useRootSelector();
    const translate = useTranslate();
    const [versions, setVersions] = useState<RaRecord>();

    useEffect(() => {
        if (dataProvider) {
            dataProvider
                .getLatest(resource, { record, root })
                .then(versions => {
                    setVersions(versions.data);
                });
        }
    }, [dataProvider, record, resource]);

    if (!versions || !record || !dataProvider) return <></>;
    return (
        <MaterialTable>
            <TableHead>
                <TableRow>
                    <TableCell align="center">
                        {translate('resources.list.expandable.version')}
                    </TableCell>
                    <TableCell align="center">
                        {translate('resources.list.expandable.created')}
                    </TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {versions.map(item => (
                    <TableRow key={item.id}>
                        <TableCell component="th" scope="row" align="center">
                            {item.metadata?.version}
                        </TableCell>
                        <TableCell align="center">
                            <DateField
                                source="created"
                                record={item.metadata}
                            />
                        </TableCell>
                        <TableCell size="small" align="right">
                            <ShowButton record={item} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </MaterialTable>
    );
};

export const PostEditToolbar = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(-1);
    };
    return (
        <Toolbar>
            <SaveButton />
            <Button
                color="info"
                label={translate('buttons.cancel')}
                onClick={handleClick}
            >
                <ClearIcon />
            </Button>
            <NewVersionButton />
        </Toolbar>
    );
};
export const TaskToolbar = () => {
    return (
        <Toolbar>
            <SaveButton />
        </Toolbar>
    );
};

// export const ShowWrapper = (props: LayoutContentProps) => {
//     const { children } = props;
//     const record = useRecordContext();
//     const dataProvider = useDataProvider();

//     if (!dataProvider) return <></>;
//     return (
//         <>
//             <ShowPageTitle icon={<VisibilityIcon fontSize={'large'} />} />

//             <Box
//                 sx={{
//                     display: 'grid',
//                     gridTemplateColumns: { lg: '1fr 350px' },
//                     gridTemplateRows: { xs: 'repeat(1, 1fr)', lg: '' },
//                     gap: 2,
//                 }}
//             >
//                 <Box
//                     sx={{
//                         paddingBottom: 4,
//                         maxWidth: '70vw',
//                         minWidth: '100%',
//                         order: { xs: 2, lg: 1 },
//                     }}
//                 >
//                     {children}
//                 </Box>

//                 <Box
//                     display="block"
//                     sx={{ order: { xs: 1, lg: 2 } }}
//                     pt={{ xs: 0, lg: 6 }}
//                 >
//                     <VersionsListWrapper record={record} />
//                 </Box>
//             </Box>
//         </>
//     );
// };

export const Aside = () => {
    const record = useRecordContext();
    return <VersionsListWrapper record={record} />;
};

const VersionsListWrapper = memo(function VersionsListWrapper(props: {
    record: any;
}) {
    const { record } = props;
    const translate = useTranslate();

    return (
        <Card
            sx={{
                height: 'fit-content',
                borderRadius: '10px',
                order: { xs: 1, lg: 2 },
            }}
            variant="outlined"
        >
            <CardHeader title={translate('resources.common.version.title')} />

            <CardContent
                sx={{
                    paddingTop: 0,
                }}
            >
                <VersionsList record={record} />
            </CardContent>
        </Card>
    );
},
arePropsEqual);

export const TaskComponent = () => {
    return <div>Json Scehma input</div>;
};
export const FunctionList = () => {
    const record = useRecordContext();
    const dataProvider = useDataProvider();
    if (!record || !record.metadata || !dataProvider) return <></>;
    return (
        <List>
            <Datagrid>
                <TextField source="id" />
                <TextField source="title" />
            </Datagrid>
        </List>
    );
};
