import {
    DataGrid,
    enUS,
    gridClasses,
    GridColDef,
    itIT,
} from '@mui/x-data-grid';
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
            valueFormatter: params => {
                if (params.value == null) {
                    return '-';
                }
                return valueFormatter(params.value);
            },
        },
    ];

    return (
        <DataGrid
            columns={columns}
            rows={values}
            getRowId={row => row.label}
            getRowHeight={() => 'auto'}
            autoHeight
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
    );
};
