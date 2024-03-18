import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useTranslate } from 'react-admin';
import { Spinner } from '../../../components/Spinner';
import { useDataGridController } from './usePreviewDataGridController';

export const PreviewTabComponent = (props: { record: any }) => {
    const { record } = props;
    const translate = useTranslate();

    const { data, isLoading, isAtLeastOneColumnUnsupported } =
        useDataGridController({
            schema: record?.spec?.schema,
            preview: record?.status?.preview,
        });

    if (isLoading) return <Spinner />;
    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            <Typography variant="h6" gutterBottom>
                {translate('resources.dataitems.preview.title')}
            </Typography>

            <DataGrid
                columns={data?.columns || []}
                rows={data?.rows || []}
                autoHeight
                columnHeaderHeight={isAtLeastOneColumnUnsupported ? 90 : 56}
                hideFooter={true}
                sx={theme => ({
                    '& .MuiDataGrid-cell.invalid': {
                        backgroundColor: theme.palette.warning.main,
                    },
                    '& .invalid .cell-content': {
                        fontWeight: 'bold',
                    },
                    '& .MuiDataGrid-cell.unsupported': {
                        backgroundColor: 'rgba(0, 0, 0, 0.06)',
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
                })}
            />
        </Box>
    );
};
