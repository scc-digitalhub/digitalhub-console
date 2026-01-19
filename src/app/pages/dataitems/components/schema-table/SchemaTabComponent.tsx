// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box, Typography, alpha } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { enUS, itIT } from '@mui/x-data-grid/locales';
import { useLocaleState, useTranslate } from 'react-admin';
import { useSchemaDataGridController } from './useSchemaDataGridController';
import { Spinner } from '../../../../../common/components/layout/Spinner';

export const SchemaTabComponent = (props: { record: any }) => {
    const { record } = props;
    const translate = useTranslate();
    const [locale] = useLocaleState();
    const localeText =
        locale && locale === 'it'
            ? itIT.components.MuiDataGrid.defaultProps.localeText
            : enUS.components.MuiDataGrid.defaultProps.localeText;

    const { data, isLoading } = useSchemaDataGridController({
        schema: record?.spec?.schema,
    });

    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            <Typography variant="h6" gutterBottom>
                {translate('resources.dataitems.schema.title')}
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
