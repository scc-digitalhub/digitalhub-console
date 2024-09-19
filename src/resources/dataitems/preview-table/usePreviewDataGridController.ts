import { GridColDef, GridRowsProp } from '@mui/x-data-grid';
import * as changeCase from 'change-case';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslate } from 'react-admin';
import { InvalidFieldInfo, PreviewHelper, Value } from './PreviewHelper';

export const usePreviewDataGridController = (props: {
    preview: any;
    schema?: any;
}): PreviewDataGridControllerResult => {
    const { preview, schema } = props;
    const translate = useTranslate();

    const translations = {
        invalidValue: translate('messages.validation.invalidValue'),
        invalidDate: translate('messages.validation.invalidDate'),
        invalidDatetime: translate('messages.validation.invalidDatetime'),
    };

    const [data, setData] = useState<{
        rows: GridRowsProp;
        columns: GridColDef[];
    } | null>(null);
    const [isAtLeastOneColumnUnsupported, setIsAtLeastOneColumnUnsupported] =
        useState<boolean>(false);

    const isLoading = useRef<boolean>(false);

    const fields = useMemo(() => {
        return schema?.fields && schema.fields instanceof Array
            ? schema.fields
            : [];
    }, [schema]);

    const cols = useMemo(() => {
        return preview?.cols && preview.cols instanceof Array
            ? preview.cols
            : [];
    }, [schema]);

    useEffect(() => {
        isLoading.current = true;

        if (fields && fields.length > 0 && cols && cols.length > 0) {
            // columns
            const columns = fields.map((obj: any) => {
                const basicFields = PreviewHelper.getBasicFields(
                    obj,
                    translations
                );

                const columnFields = PreviewHelper.getColumnFields(
                    obj,
                    translations
                );

                return columnFields
                    ? { ...basicFields, ...columnFields }
                    : basicFields;
            });

            //TODO remove
            if (
                fields.some((obj: any) =>
                    PreviewHelper.isUnsupportedColumn(obj)
                )
            ) {
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
        } else {
            setData({ rows: [], columns: [] });
        }

        isLoading.current = false;
    }, [fields, cols]);

    return {
        data: data,
        isLoading: isLoading.current,
        isAtLeastOneColumnUnsupported,
        numberOfRows: preview?.rows || 0,
    };
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
