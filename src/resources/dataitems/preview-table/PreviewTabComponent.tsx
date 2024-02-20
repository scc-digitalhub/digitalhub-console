import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import * as changeCase from 'change-case';
import { useEffect, useState } from 'react';
import { useTranslate } from 'react-admin';
import { PreviewHelper } from './PreviewHelper';

export const PreviewTabComponent = (props: { record: any }) => {
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
            const basicFields = PreviewHelper.getBasicFields(obj, translations);

            const columnFields = PreviewHelper.getColumnFields(
                obj,
                translations
            );

            return columnFields
                ? { ...basicFields, ...columnFields }
                : basicFields;
        });

        setColumns(useEffectColumns);

        if (schema.some((obj: any) => PreviewHelper.isUnsupportedColumn(obj))) {
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
                    let value = PreviewHelper.getValue(v, columnDescriptor);

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
            }}
        >
            <DataGrid
                columns={columns}
                rows={rows}
                autoHeight
                columnHeaderHeight={isAtLeastOneColumnUnsupported ? 90 : 56}
                hideFooter={true}
                sx={{
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
                    '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
                        '&:not(:last-child)': {
                            borderRight: '1px solid rgba(224, 224, 224, 1)',
                        },
                    },
                }}
            />
        </Box>
    );
};
