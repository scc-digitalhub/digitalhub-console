// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { alpha } from '@mui/material/styles';
import { PreviewButton } from '../../download/components/PreviewButton';
import { DownloadButton } from '../../download/components/DownloadButton';
import { TopToolbar, useLocaleState } from 'react-admin';
import { enUS, itIT } from '@mui/x-data-grid/locales';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { useDataGridController } from '../../../../common/hooks/useDataGridController';
import { scaleBytes } from '../../../../common/utils/helpers';

export const InfoTable = (props: any) => {
    const { info } = props;
    const [locale] = useLocaleState();
    const localeText =
        locale && locale === 'it'
            ? itIT.components.MuiDataGrid.defaultProps.localeText
            : enUS.components.MuiDataGrid.defaultProps.localeText;
    const { data } = useDataGridController({
        fields: info.data,
    });

    const valueFormatter = (value?: any, row?) => {
        if (!value) {
            return '';
        }
        // if value is bytes, format
        if (row && row.key == 'size') {
            return scaleBytes(value, 2);
        }
        if (!isNaN(value)) {
            return value;
        }
        const toDate = new Date(value);
        if (!isNaN(toDate.getTime())) {
            return toDate.toLocaleString();
        }

        if (typeof value === 'object') {
            return JSON.stringify(value);
        }
        return value;
    };

    const columnsWithFormatter = data?.columns.map(col => {
        if (col.field === 'value') {
            col['valueFormatter'] = valueFormatter;
        }
        return col;
    });

    return (
        <>
            {!(info.children && info.children.length > 0) && (
                <TopToolbar>
                    {info.fileType && info.data.path ? (
                        <PreviewButton
                            sub={info.data.path}
                            fileType={info.fileType}
                            fileName={info.label || undefined}
                        />
                    ) : (
                        <PreviewButton
                            fileType={info.fileType}
                            fileName={info.label || undefined}
                        />
                    )}
                    {info.data.path ? (
                        <DownloadButton sub={info.data.path} />
                    ) : (
                        <DownloadButton />
                    )}
                </TopToolbar>
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <DataGrid
                    columns={columnsWithFormatter || []}
                    rows={data?.rows || []}
                    getRowHeight={() => 'auto'}
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
                        [`& .${gridClasses.cell}`]: {
                            py: 2,
                        },
                    })}
                />
            </div>
        </>
    );
};
