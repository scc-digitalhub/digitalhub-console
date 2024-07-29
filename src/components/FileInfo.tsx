import { useRootSelector } from '@dslab/ra-root-selector';
import { Box, Typography, alpha } from '@mui/material';
import { useEffect, useState } from 'react';
import {
    useDataProvider,
    useLocaleState,
    useNotify,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { Spinner } from './Spinner';
import { DataGrid, enUS, gridClasses, itIT } from '@mui/x-data-grid';
import { useDataGridController } from '../controllers/useDataGridController';
import { EmptyList } from '../pages/dashboard/EmptyList';

type FileInfoResult = {
    loading: boolean;
    data: any;
};

export const FileInfo = () => {
    const record = useRecordContext();
    const dataProvider = useDataProvider();
    const { root } = useRootSelector();
    const resource = useResourceContext();
    const notify = useNotify();
    const translate = useTranslate();
    const [result, setResult] = useState<FileInfoResult>({
        loading: false,
        data: null,
    });

    useEffect(() => {
        if (record && dataProvider) {
            if (record.status?.files) {
                //status.files = [{fileinfo},{fileinfo}]
                setResult({ loading: false, data: record.status.files[0] });
            } else {
                setResult({ loading: true, data: null });
                dataProvider
                    .fileInfo(resource, { id: record.id, meta: { root } })
                    .then(data => {
                        //data.info = [{fileinfo},{fileinfo}]
                        if (data?.info && data.info.length !== 0) {
                            const currentFileInfo = data.info[0];
                            setResult({
                                loading: false,
                                data: currentFileInfo,
                            });
                        } else {
                            setResult({ loading: false, data: null });
                            notify('ra.message.not_found', {
                                type: 'error',
                            });
                        }
                    })
                    .catch(error => {
                        setResult({ loading: false, data: null });
                        const e =
                            typeof error === 'string'
                                ? error
                                : error.message || 'error';
                        notify(e);
                    });
            }
        }
    }, [dataProvider, notify, record, resource, root]);

    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            <Typography variant="h6" gutterBottom>
                {translate('fields.status.files')}
            </Typography>

            {result.loading ? (
                <Spinner />
            ) : result.data ? (
                <FileInfoTable info={result.data} />
            ) : (
                <EmptyResult />
            )}
        </Box>
    );
};

const EmptyResult = () => {
    const translate = useTranslate();

    return (
        <Typography
            variant="body1"
            color={'gray'}
            sx={{ textAlign: 'center', pt: 5 }}
        >
            {translate('fields.info.empty')}
        </Typography>
    );
};

const FileInfoTable = (props: any) => {
    const { info } = props;
    const [locale] = useLocaleState();
    const localeText =
        locale && locale === 'it'
            ? itIT.components.MuiDataGrid.defaultProps.localeText
            : enUS.components.MuiDataGrid.defaultProps.localeText;
    const { data, isLoading } = useDataGridController({
        fields: info,
    });

    const valueFormatter = (value?: any) => {
        if (!value.value) {
            return '';
        }
        if (!isNaN(value.value)) {
            return value.value;
        }
        const toDate = new Date(value.value);
        if (!isNaN(toDate.getTime())) {
            return toDate.toLocaleString();
        }

        if (typeof value.value === 'object') {
            return JSON.stringify(value.value);
        }
        return value.value;
    };

    const columnsWithFormatter = data?.columns.map(col => {
        if (col.field === 'value') {
            col['valueFormatter'] = valueFormatter;
        }
        return col;
    });

    return (
        <DataGrid
            columns={columnsWithFormatter || []}
            rows={data?.rows || []}
            getRowHeight={() => 'auto'}
            autoHeight
            hideFooter={data?.rows && data.rows.length > 100 ? false : true}
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
                    py: 2,
                },
            })}
        />
    );
};
