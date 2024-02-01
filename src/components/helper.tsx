import { BackButton } from '@dslab/ra-back-button';
import { ExportRecordButton } from '@dslab/ra-export-record-button';
import { InspectButton } from '@dslab/ra-inspect-button';
import { useRootSelector } from '@dslab/ra-root-selector';
import ClearIcon from '@mui/icons-material/Clear';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import {
    Box,
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
    Pagination,
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
import Grid from '@mui/material/Grid';

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

const arePropsEqual = (oldProps: any, newProps: any) => {
    if (!newProps.record) return true;
    return Object.is(oldProps.record, newProps.record);
};

const ShowToolbar = memo(function ShowToolbar(props: { record: any }) {
    if (!props.record) return <></>;
    return (
        <TopToolbar>
            <BackButton sx={{ display: { xs: 'none', lg: 'flex' } }} />
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
const getStyle= (record:any) => {
    const curRecord = record || {};
    return {
        rowSx: record => ({
            backgroundColor:
                record.id === curRecord.id
                    ? 'rgb(25, 118, 210, 0.15)'
                    : 'white',
            ':hover': {
                backgroundColor:
                    record.id === curRecord.id
                        ? 'rgb(25, 118, 210, 0.25) !important'
                        : 'rgba(0, 0, 0, 0.04)',
            },
        }),
    };
};

export const LayoutContent = (props: LayoutContentProps) => {
    const { children, record } = props;
    const dataProvider = useDataProvider();
    const translate = useTranslate();

    if (!dataProvider) return <></>;
    return (
        <Grid
            container
            spacing={4}
            direction={{ xs: 'column-reverse', lg: 'row' }}
            flexWrap={{ xs: 'nowrap', lg: 'wrap' }}
        >
            <Grid item xs={12} lg={6} xl={7} pb={2}>
                {children}
            </Grid>

            <Grid item xs={12} lg={6} xl={5}>
                <TopToolbar sx={{ justifyContent: 'flex-start' }}>
                    <BackButton sx={{ display: { xs: 'flex', lg: 'none' } }} />
                </TopToolbar>

                <Card
                    sx={{
                        height: 'fit-content',
                        borderRadius: '10px',
                    }}
                    variant="outlined"
                >
                    <CardHeader
                        title={translate('resources.common.version.title')}
                    />

                    <CardContent
                        sx={{
                            paddingTop: 1,
                            paddingBottom: '8px !important',
                        }}
                    >
                        <BoxContent record={record} />
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

const BoxContent = memo(function BoxContent(props: { record: any }) {
    if (!props.record) return <></>;
    return (
        <List
            queryOptions={{ meta: { allVersion: true, record: props.record } }}
            actions={false}
            disableSyncWithLocation={true}
            pagination={<Pagination rowsPerPageOptions={[5, 10, 25]} />}
        >
            <Datagrid
                rowClick="show"
                rowSx={getStyle(props.record).rowSx}
                bulkActionButtons={false}
            >
                <TextField
                    source="metadata.version"
                    label="resources.common.version.version"
                />
                <DateField
                    source="metadata.created"
                    label="resources.common.version.created"
                />
            </Datagrid>
        </List>
    );
}, arePropsEqual);

type LayoutContentProps = {
    children: ReactNode;
    record: any;
};

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

export const OutlinedCard = (props: { children }) => (
    <Card variant="outlined" sx={{ width: '100%', borderRadius: '10px' }}>
        {props.children}
    </Card>
);
