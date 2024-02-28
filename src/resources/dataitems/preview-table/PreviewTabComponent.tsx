import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import * as changeCase from 'change-case';
import { useEffect, useState } from 'react';
import { useTranslate } from 'react-admin';
import { InvalidFieldInfo, PreviewHelper, Value } from './PreviewHelper';

export const PreviewTabComponent = (props: { record: any }) => {
    const [columns, setColumns] = useState<GridColDef[]>([]);
    const [rows, setRows] = useState<GridRowsProp>([]);
    const [isAtLeastOneColumnUnsupported, setIsAtLeastOneColumnUnsupported] =
        useState<boolean>(false);
    const translate = useTranslate();
    const translations = {
        invalidValue: translate('resources.dataitem.preview.invalidValue'),
        invalidDate: translate('resources.dataitem.preview.invalidDate'),
        invalidDatetime: translate(
            'resources.dataitem.preview.invalidDatetime'
        ),
    };

    useEffect(() => {
        const schema = props.record?.spec?.schema || [];

        const useEffectColumns = schema.map((obj: any) => {
            const basicFields = PreviewHelper.getBasicFields(obj, translations);

            const columnFields = PreviewHelper.getColumnFields(
                obj,
                translations
            );

            return columnFields
                ? { ...basicFields, ...columnFields }
                : basicFields;
        });

        setColumns(useEffectColumns);

        if (schema.some((obj: any) => PreviewHelper.isUnsupportedColumn(obj))) {
            setIsAtLeastOneColumnUnsupported(true);
        }
    }, [props.record]);

    useEffect(() => {
        const preview = props.record?.status?.preview || [];
        const schema = props.record?.spec?.schema || [];
        const useEffectRows: { [key: string]: any }[] = [];

        preview.forEach((obj: any) => {
            const field = changeCase.camelCase(obj.name);
            const columnDescriptor = schema.find(
                (s: any) => s.name === obj.name
            );

            if (columnDescriptor) {
                obj.value.forEach((v: any, i: number) => {
                    const valueObj: Value = PreviewHelper.getValue(
                        v,
                        columnDescriptor
                    );

                    // TODO: field must not be equal to "id" and "invalidFieldsInfo"
                    if (!useEffectRows.some(r => r.id === i)) {
                        useEffectRows.push({
                            id: i,
                            [field]: valueObj.value,
                            invalidFieldsInfo: valueObj.isValid
                                ? []
                                : [
                                      new InvalidFieldInfo(
                                          field,
                                          valueObj.invalidityType!
                                      ),
                                  ],
                        });
                    } else {
                        useEffectRows[i][field] = valueObj.value;
                        if (!valueObj.isValid) {
                            useEffectRows[i].invalidFieldsInfo.push(
                                new InvalidFieldInfo(
                                    field,
                                    valueObj.invalidityType!
                                )
                            );
                        }
                    }

                    console.error("external", useEffectRows, valueObj);
                });
            }
        });

        console.error("useEffectRows", useEffectRows);
        setRows(useEffectRows);
    }, [props.record]);

    if (!columns || !rows) {
        return null;
    }

    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            <DataGrid
                columns={columns}
                rows={rows}
                autoHeight
                columnHeaderHeight={isAtLeastOneColumnUnsupported ? 90 : 56}
                hideFooter={true}
                sx={theme => ({
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
        </Box>
    );
};
