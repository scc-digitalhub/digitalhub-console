import { Box, Typography, alpha } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useTranslate } from 'react-admin';
import { Spinner } from '../../../components/Spinner';
import { usePreviewDataGridController } from './usePreviewDataGridController';

export const PreviewTabComponent = (props: { record: any }) => {
    const { record } = props;
    const translate = useTranslate();

    const { data, isLoading, isAtLeastOneColumnUnsupported, numberOfRows } =
        usePreviewDataGridController({
            schema: record?.spec?.schema,
            preview: record?.status?.preview,
        });

    const numberOfRowsLabel = `${translate(
        'resources.dataitems.preview.numberOfRows'
    )}: ${numberOfRows}`;

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
                    '& .MuiDataGrid-columnHeader': {
                        backgroundColor: alpha(
                            theme.palette?.primary?.main,
                            0.12
                        ),
                    },
                    '& .MuiDataGrid-cell.invalid': {
                        backgroundColor: theme.palette.warning.light,
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

            <Typography
                variant="body2"
                display="flex"
                justifyContent="end"
                pt={2}
            >
                {numberOfRowsLabel}
            </Typography>
        </Box>
    );
};
