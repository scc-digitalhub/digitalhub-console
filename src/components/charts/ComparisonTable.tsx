// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { DataGrid, gridClasses, GridColDef } from '@mui/x-data-grid';
import { enUS, itIT } from '@mui/x-data-grid/locales';
import { alpha } from '@mui/material';
import { useLocaleState, useTranslate } from 'react-admin';
import { Series, valueFormatter } from './utils';

export const ComparisonTable = (props: { values: Series[] }) => {
    const { values } = props;
    const translate = useTranslate();
    const [locale] = useLocaleState();
    const localeText =
        locale && locale === 'it'
            ? itIT.components.MuiDataGrid.defaultProps.localeText
            : enUS.components.MuiDataGrid.defaultProps.localeText;

    const columns: GridColDef[] = [
        {
            field: 'label',
            headerName: translate('fields.datagrid.key'),
            flex: 3,
        },
        {
            field: 'data',
            headerName: translate('fields.datagrid.value'),
            flex: 1,
            valueFormatter: (value: any) => {
                if (value == null) {
                    return '-';
                }
                return valueFormatter(value);
            },
        },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <DataGrid
                columns={columns}
                rows={values}
                getRowId={row => row.label}
                getRowHeight={() => 'auto'}
                hideFooter
                localeText={localeText}
                sx={theme => ({
                    '& .MuiDataGrid-columnHeader': {
                        backgroundColor: alpha(theme.palette?.primary?.main, 0.12),
                    },
                    '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
                        '&:not(:last-child)': {
                            borderRight: '1px solid rgba(224, 224, 224, 1)',
                        },
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                        fontWeight: 'bold',
                    },
                    [`& .${gridClasses.cell}`]: {
                        py: 1,
                    },
                })}
            />
        </div>
    );
};
