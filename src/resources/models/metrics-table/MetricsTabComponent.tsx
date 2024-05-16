import { Box, Typography, alpha } from '@mui/material';
import { DataGrid, enUS, itIT } from '@mui/x-data-grid';
import { useLocaleState, useTranslate } from 'react-admin';
import { Spinner } from '../../../components/Spinner';
import { useMetricsDataGridController } from './useMetricsDataGridController';

export const MetricsTabComponent = (props: { record: any }) => {
    const { record } = props;
    const translate = useTranslate();
    const [locale] = useLocaleState();
    const localeText =
        locale && locale === 'it'
            ? itIT.components.MuiDataGrid.defaultProps.localeText
            : enUS.components.MuiDataGrid.defaultProps.localeText;

    const { data, isLoading } = useMetricsDataGridController({
        metrics: record?.spec?.metrics,
    });

    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            <Typography variant="h6" gutterBottom>
                {translate('resources.models.metrics.title')}
            </Typography>

            {isLoading ? (
                <Spinner />
            ) : (
                <DataGrid
                    columns={data?.columns || []}
                    rows={data?.rows || []}
                    autoHeight
                    hideFooter={
                        data?.rows && data.rows.length > 100 ? false : true
                    }
                    localeText={localeText}
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
            )}
        </Box>
    );
};
