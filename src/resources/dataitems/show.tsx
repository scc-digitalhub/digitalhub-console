import { JsonSchemaField } from '@dslab/ra-jsonschema-input';
import { Box, Grid, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import * as changeCase from 'change-case';
import inflection from 'inflection';
import { memo, useEffect, useState } from 'react';
import {
    Labeled,
    Show,
    TabbedShowLayout,
    TextField,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import { MetadataSchema } from '../../common/types';
import {
    LayoutContent,
    OutlinedCard,
    PostShowActions,
} from '../../components/helper';
import { DataItemSpecSchema, DataItemSpecUiSchema } from './types';
import { getTypeFields, getValue, isUnsupported } from './helper';
import { arePropsEqual } from '../../common/helper';

const ShowComponent = (props: { setRecord: (record: any) => void }) => {
    const record = useRecordContext();

    useEffect(() => {
        props.setRecord(record);
    }, [record]);

    return <DataItemShowLayout record={record} />;
};

const DataItemShowLayout = memo(function DataItemShowLayout(props: {
    record: any;
}) {
    const translate = useTranslate();

    if (!props.record) return <></>;
    return (
        <TabbedShowLayout syncWithLocation={false} record={props.record}>
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
            (acc: GridColDef[], fieldDescriptor: any) => {
                const filteredKeys = Object.keys(fieldDescriptor).filter(
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
    const translate = useTranslate();
    const unsupportedLabel: string = translate(
        'resources.dataitem.preview.unsupported'
    );

    useEffect(() => {
        const schema = props.record?.spec?.schema || [];
        const useEffectColumns = schema.map((obj: any) => {
            const basicFields = {
                field: changeCase.camelCase(obj.name),
                flex: 1,
                //minWidth: 100,
                headerAlign: 'left',
                align: 'left',
                renderHeader: () => {
                    const typeLabel = `(${obj.type.toUpperCase()})`;
                    return (
                        <Box
                            display="flex"
                            flexDirection="column"
                            lineHeight="16px"
                        >
                            <span
                                style={{
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    fontWeight: '500',
                                    paddingBottom: '5px',
                                }}
                            >
                                {obj.name}
                            </span>
                            <span
                                style={{
                                    opacity: 0.6,
                                    fontSize: '12px',
                                }}
                            >
                                {typeLabel}
                            </span>
                        </Box>
                    );
                },
            };

            const typeFields = getTypeFields(obj);

            return typeFields ? { ...basicFields, ...typeFields } : basicFields;
        });
        setColumns(useEffectColumns);
    }, [props.record]);

    useEffect(() => {
        const preview = props.record?.status?.preview || [];
        const schema = props.record?.spec?.schema || [];
        const useEffectRows: { [key: string]: any }[] = [];

        preview.forEach((obj: any) => {
            const field = changeCase.camelCase(obj.name);
            const fieldDescriptor = schema.find(
                (s: any) => s.name === obj.name
            );

            if (fieldDescriptor) {
                obj.value.forEach((v: any, i: number) => {
                    let value = getValue(v, fieldDescriptor);
                    if (isUnsupported(value)) value = unsupportedLabel;

                    if (!useEffectRows.some(r => r.id === i)) {
                        useEffectRows.push({ id: i, [field]: value });
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
            }}
        >
            <DataGrid columns={columns} rows={rows} autoHeight />
        </Box>
    );
};

export const DataItemShow = () => {
    const [record, setRecord] = useState(undefined);

    return (
        <LayoutContent record={record}>
            <Show
                actions={<PostShowActions />}
                sx={{ width: '100%' }}
                component={OutlinedCard}
            >
                <ShowComponent setRecord={setRecord} />
            </Show>
        </LayoutContent>
    );
};
