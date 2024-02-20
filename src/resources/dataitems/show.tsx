import { JsonSchemaField } from '@dslab/ra-jsonschema-input';
import { Box, Container, Grid, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import * as changeCase from 'change-case';
import inflection from 'inflection';
import { memo, useEffect, useState } from 'react';
import {
    Labeled,
    ShowBase,
    ShowView,
    TabbedShowLayout,
    TextField,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import { arePropsEqual } from '../../common/helper';
import { MetadataSchema } from '../../common/types';
import { ShowOutlinedCard } from '../../components/OutlinedCard';
import { ShowPageTitle } from '../../components/pageTitle';
import { Aside, PostShowActions } from '../../components/helper';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    getBasicFields,
    getColumnFields,
    getValue,
    isUnsupportedColumn,
} from './helper';
import { DataItemSpecSchema, DataItemSpecUiSchema } from './types';

const ShowComponent = () => {
    const record = useRecordContext();

    return <DataItemShowLayout record={record} />;
};

const DataItemShowLayout = memo(function DataItemShowLayout(props: {
    record: any;
}) {
    const { record } = props;
    const translate = useTranslate();

    if (!record) return <></>;
    return (
        <TabbedShowLayout syncWithLocation={false} record={record}>
            <TabbedShowLayout.Tab label="resources.dataitem.tab.summary">
                <Grid>
                    <Typography variant="h6" gutterBottom>
                        {translate('resources.dataitem.title')}
                    </Typography>

                    <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={6}>
                            <Labeled label="resources.dataitem.name">
                                <TextField source="name" />
                            </Labeled>
                        </Grid>
                        <Grid item xs={6}>
                            <Labeled label="resources.dataitem.kind">
                                <TextField source="kind" />
                            </Labeled>
                        </Grid>
                    </Grid>

                    <JsonSchemaField
                        source="metadata"
                        schema={MetadataSchema}
                    />

                    <JsonSchemaField
                        source="spec"
                        schema={DataItemSpecSchema}
                        uiSchema={DataItemSpecUiSchema}
                        label="resources.dataitem.summary.spec.title"
                    />
                </Grid>
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="resources.dataitem.tab.schema">
                <SchemaTabComponent record={props.record} />
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="resources.dataitem.tab.preview">
                <PreviewTabComponent record={props.record} />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    );
},
arePropsEqual);

const SchemaTabComponent = (props: { record: any }) => {
    const [columns, setColumns] = useState<GridColDef[]>([]);
    const [rows, setRows] = useState<GridRowsProp>([]);
    const translate = useTranslate();

    useEffect(() => {
        const schema = props.record?.spec?.schema || [];

        const baseColumns: GridColDef[] = [
            {
                field: 'name',
                headerName: translate('resources.dataitem.schema.name'),
                flex: 1,
            },
            {
                field: 'type',
                headerName: translate('resources.dataitem.schema.type'),
                flex: 1,
            },
        ];

        const dynamicColumns = schema.reduce(
            (acc: GridColDef[], columnDescriptor: any) => {
                const filteredKeys = Object.keys(columnDescriptor).filter(
                    key => key !== 'name' && key !== 'type'
                );

                filteredKeys.forEach(key => {
                    if (!acc.some(r => r.field === key)) {
                        const label = inflection.transform(
                            key.replace(/\./g, ' '),
                            ['underscore', 'humanize']
                        );

                        acc.push({
                            field: key,
                            headerName: label,
                            flex: 1,
                        });
                    }
                });
                return acc;
            },
            []
        );

        setColumns([...baseColumns, ...dynamicColumns]);
    }, [props.record]);

    useEffect(() => {
        const schema = props.record?.spec?.schema || [];
        setRows(schema.map((obj: any, i: number) => ({ id: i, ...obj })));
    }, [props.record]);

    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            <DataGrid columns={columns} rows={rows} autoHeight />
        </Box>
    );
};

const PreviewTabComponent = (props: { record: any }) => {
    const [columns, setColumns] = useState<GridColDef[]>([]);
    const [rows, setRows] = useState<GridRowsProp>([]);
    const [isAtLeastOneColumnUnsupported, setIsAtLeastOneColumnUnsupported] =
        useState<boolean>(false);
    const translate = useTranslate();
    const translations = {
        unsupported: translate('resources.dataitem.preview.unsupported'),
        invalidDate: translate('resources.dataitem.preview.invalidDate'),
        invalidDatetime: translate(
            'resources.dataitem.preview.invalidDatetime'
        ),
    };

    useEffect(() => {
        const schema = props.record?.spec?.schema || [];

        const useEffectColumns = schema.map((obj: any) => {
            const basicFields = getBasicFields(obj, translations);

            const columnFields = getColumnFields(obj, translations);

            return columnFields
                ? { ...basicFields, ...columnFields }
                : basicFields;
        });

        setColumns(useEffectColumns);

        if (schema.some((obj: any) => isUnsupportedColumn(obj))) {
            setIsAtLeastOneColumnUnsupported(true);
        }
    }, [props.record]);

    useEffect(() => {
        const preview = props.record?.status?.preview || [];
        const schema = props.record?.spec?.schema || [];
        const useEffectRows: { [key: string]: any }[] = [];

        preview.forEach((obj: any) => {
            const field = changeCase.camelCase(obj.name);
            const columnDescriptor = schema.find(
                (s: any) => s.name === obj.name
            );

            if (columnDescriptor) {
                obj.value.forEach((v: any, i: number) => {
                    let value = getValue(v, columnDescriptor);

                    if (!useEffectRows.some(r => r.id === i)) {
                        useEffectRows.push({
                            id: i,
                            [field]: value,
                        });
                    } else {
                        useEffectRows[i][field] = value;
                    }
                });
            }
        });

        setRows(useEffectRows);
    }, [props.record]);

    return (
        <Box
            sx={{
                width: '100%',
                '& .unsupported': {
                    backgroundColor: 'rgba(0, 0, 0, 0.06)',
                },
                '& .unsupported .MuiDataGrid-cellContent, .unsupported .cellContent':
                    {
                        fontWeight: 'bold',
                    },
                '& .unsupported .MuiDataGrid-columnHeaderTitleContainerContent':
                    {
                        width: '100%',
                    },
                '& .unsupported .MuiDataGrid-menuIcon': {
                    display: 'none',
                },
            }}
        >
            <DataGrid
                columns={columns}
                rows={rows}
                autoHeight
                columnHeaderHeight={isAtLeastOneColumnUnsupported ? 90 : 56}
                hideFooter={true}
            />
        </Box>
    );
};

export const DataItemShow = () => {
    return (
        <Container maxWidth={false}>
            <ShowBase>
                <>
                    <ShowPageTitle
                        icon={<VisibilityIcon fontSize={'large'} />}
                    />
                    <ShowView
                        actions={<PostShowActions />}
                        sx={{
                            width: '100%',
                            '& .RaShow-main': {
                                display: 'grid',
                                gridTemplateColumns: { lg: '1fr 350px' },
                                gridTemplateRows: {
                                    xs: 'repeat(1, 1fr)',
                                    lg: '',
                                },
                                gap: 2,
                            },
                        }}
                        component={ShowOutlinedCard}
                        aside={<Aside />}
                    >
                        <ShowComponent />
                    </ShowView>
                </>
            </ShowBase>
        </Container>
    );
};
