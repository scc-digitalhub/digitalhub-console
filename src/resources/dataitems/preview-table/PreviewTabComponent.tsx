import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useTranslate } from 'react-admin';
import { Spinner } from '../../../components/Spinner';
import { useDataGridController } from './usePreviewDataGridController';

export const PreviewTabComponent = (props: { record: any }) => {
    const { record } = props;

    const translate = useTranslate();
    const translations = {
        invalidValue: translate('resources.dataitem.preview.invalidValue'),
        invalidDate: translate('resources.dataitem.preview.invalidDate'),
        invalidDatetime: translate(
            'resources.dataitem.preview.invalidDatetime'
        ),
    };

    const { dataGridData, isSettingUpData, isAtLeastOneColumnUnsupported } =
        useDataGridController({
            record,
            translations,
        });

    if (isSettingUpData) return <Spinner />;
    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            <Typography variant="h6" gutterBottom>
                {translate('resources.dataitem.preview.title')}
            </Typography>

            <DataGrid
                columns={dataGridData ? dataGridData.columns : []}
                rows={dataGridData ? dataGridData.rows : []}
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
