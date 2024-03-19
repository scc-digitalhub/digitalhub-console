import { GridColDef, GridRowsProp } from '@mui/x-data-grid';
import * as changeCase from 'change-case';
import { useEffect, useRef, useState } from 'react';
import { useTranslate } from 'react-admin';
import { InvalidFieldInfo, PreviewHelper, Value } from './PreviewHelper';

export const usePreviewDataGridController = (
    props: PreviewDataGridControllerProps
): PreviewDataGridControllerResult => {
    const { preview, schema = {} } = props;
    const translate = useTranslate();
    const translations = {
        invalidValue: translate('validation.invalidValue'),
        invalidDate: translate('validation.invalidDate'),
        invalidDatetime: translate('validation.invalidDatetime'),
    };
    
    const [data, setData] = useState<{
        rows: GridRowsProp;
        columns: GridColDef[];
    } | null>(null);
    const [isAtLeastOneColumnUnsupported, setIsAtLeastOneColumnUnsupported] =
        useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const timer = useRef<any>(null);

    useEffect(() => {
        clearTimeout(timer.current);
        setIsLoading(true);

        const fields = schema?.fields || [];
        const cols = preview?.cols || [];

        // columns
        const columns = fields.map((obj: any) => {
            const basicFields = PreviewHelper.getBasicFields(obj, translations);

            const columnFields = PreviewHelper.getColumnFields(
                obj,
                translations
            );

            return columnFields
                ? { ...basicFields, ...columnFields }
                : basicFields;
        });

        if (fields.some((obj: any) => PreviewHelper.isUnsupportedColumn(obj))) {
            setIsAtLeastOneColumnUnsupported(true);
        }

        // rows
        const rows: { [key: string]: any }[] = [];
        cols.forEach((obj: any) => {
            const field = changeCase.camelCase(obj.name);
            const columnDescriptor = fields.find(
                (s: any) => s.name === obj.name
            );

            if (columnDescriptor) {
                obj.value.forEach((v: any, i: number) => {
                    const valueObj: Value = PreviewHelper.getValue(
                        v,
                        columnDescriptor
                    );

                    // TODO: field must not be equal to "id" and "invalidFieldsInfo"
                    if (!rows.some(r => r.id === i)) {
                        rows.push({
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
                        rows[i][field] = valueObj.value;
                        if (!valueObj.isValid) {
                            rows[i].invalidFieldsInfo.push(
                                new InvalidFieldInfo(
                                    field,
                                    valueObj.invalidityType!
                                )
                            );
                        }
                    }
                });
            }
        });

        setData({
            columns,
            rows,
        });
    }, [preview, schema]);

    useEffect(() => {
        if (data) {
            timer.current = setTimeout(() => {
                setIsLoading(false);
            }, 350);
        }
    }, [data]);

    return {
        data: data,
        isLoading: isLoading,
        isAtLeastOneColumnUnsupported,
        numberOfRows: preview?.rows || 0,
    };
};

type PreviewDataGridControllerProps = {
    preview: any;
    schema?: any;
};

type PreviewDataGridControllerResult = {
    data: {
        rows: GridRowsProp;
        columns: GridColDef[];
    } | null;
    isLoading: boolean;
    isAtLeastOneColumnUnsupported: boolean;
    numberOfRows: number;
};
