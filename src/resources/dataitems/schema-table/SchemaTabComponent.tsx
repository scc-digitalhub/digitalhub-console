import { Box, Typography, alpha } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import inflection from 'inflection';
import { useEffect, useState } from 'react';
import { useTranslate } from 'react-admin';

export const SchemaTabComponent = (props: { record: any }) => {
    const [columns, setColumns] = useState<GridColDef[]>([]);
    const [rows, setRows] = useState<GridRowsProp>([]);
    const translate = useTranslate();

    useEffect(() => {
        const fields = props.record?.spec?.schema?.fields || [];

        const baseColumns: GridColDef[] = [
            {
                field: 'name',
                headerName: translate('resources.dataitems.schema.name'),
                flex: 1,
            },
            {
                field: 'type',
                headerName: translate('resources.dataitems.schema.type'),
                flex: 1,
            },
        ];

        const dynamicColumns = fields.reduce(
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
        const fields = props.record?.spec?.schema?.fields || [];
        setRows(fields.map((obj: any, i: number) => ({ id: i, ...obj })));
    }, [props.record]);

    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            <Typography variant="h6" gutterBottom>
                {translate('resources.dataitems.schema.title')}
            </Typography>

            <DataGrid
                columns={columns}
                rows={rows}
                autoHeight
                hideFooter={rows.length > 100 ? false : true}
                sx={theme => ({
                    '& .MuiDataGrid-columnHeader': {
                        backgroundColor: alpha(
                            theme.palette?.primary?.main,
                            0.12
                        ),
                    },
                    '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
                        '&:not(:last-child)': {
                            borderRight: '1px solid rgba(224, 224, 224, 1)',
                        },
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                        fontWeight: 'bold',
                    },
                })}
            />
        </Box>
    );
};
