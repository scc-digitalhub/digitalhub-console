import { Box, Typography, alpha } from '@mui/material';
import { DataGrid, enUS, itIT } from '@mui/x-data-grid';
import { useLocaleState, useTranslate } from 'react-admin';
import { Spinner } from '../../../components/Spinner';
import { usePreviewDataGridController } from './usePreviewDataGridController';
import { useEffect, useState } from 'react';

export const PreviewTabComponent = (props: { record: any }) => {
    const { record } = props;
    const translate = useTranslate();
    const [locale] = useLocaleState();
    const [localeText, setLocaleText] = useState(
        enUS.components.MuiDataGrid.defaultProps.localeText
    );

    const { data, isLoading, isAtLeastOneColumnUnsupported, numberOfRows } =
        usePreviewDataGridController({
            schema: record?.spec?.schema,
            preview: record?.status?.preview,
        });

    const numberOfRowsLabel = `${translate(
        'resources.dataitems.preview.numberOfRows'
    )}: ${numberOfRows}`;

    useEffect(() => {
        if (locale && locale === 'it') {
            setLocaleText(itIT.components.MuiDataGrid.defaultProps.localeText);
        } else
            setLocaleText(enUS.components.MuiDataGrid.defaultProps.localeText);
    }, [locale]);

    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            <Typography variant="h6" gutterBottom>
                {translate('resources.dataitems.preview.title')}
            </Typography>

            {isLoading && <Spinner />}

            {!isLoading &&
                (data?.columns && data?.columns.length > 0 ? (
                    <>
                        <DataGrid
                            columns={data?.columns || []}
                            rows={data?.rows || []}
                            autoHeight
                            columnHeaderHeight={
                                isAtLeastOneColumnUnsupported ? 90 : 56
                            }
                            hideFooter={true}
                            localeText={localeText}
                            sx={theme => ({
                                '& .MuiDataGrid-columnHeader': {
                                    backgroundColor: alpha(
                                        theme.palette?.primary?.main,
                                        0.12
                                    ),
                                },
                                '& .MuiDataGrid-cell.invalid': {
                                    backgroundColor:
                                        theme.palette.warning.light,
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
                                '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell':
                                    {
                                        '&:not(:last-child)': {
                                            borderRight:
                                                '1px solid rgba(224, 224, 224, 1)',
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
                    </>
                ) : (
                    <Box
                        height={160}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Typography variant="body1">
                            {translate(
                                'resources.dataitems.preview.notAvailable'
                            )}
                        </Typography>
                    </Box>
                ))}
        </Box>
    );
};
