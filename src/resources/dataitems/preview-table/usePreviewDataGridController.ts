import { GridColDef, GridRowsProp } from '@mui/x-data-grid';
import * as changeCase from 'change-case';
import { useEffect, useRef, useState } from 'react';
import { InvalidFieldInfo, PreviewHelper, Value } from './PreviewHelper';

export const useDataGridController = (
    props: DataGridControllerPrpos
): DataGridControllerResult => {
    const { record, translations } = props;

    const [dataGridData, setDataGridData] = useState<{
        rows: GridRowsProp;
        columns: GridColDef[];
    } | null>(null);
    const [isAtLeastOneColumnUnsupported, setIsAtLeastOneColumnUnsupported] =
        useState<boolean>(false);
    const [isSettingUpData, setIsSettingUpData] = useState<boolean>(true);
    const timer = useRef<any>(null);

    useEffect(() => {
        clearTimeout(timer.current);
        setIsSettingUpData(true);

        const schema = record?.spec?.schema || [];
        const preview = record?.status?.preview?.cols || [];

        // columns
        const columns = schema.map((obj: any) => {
            const basicFields = PreviewHelper.getBasicFields(obj, translations);

            const columnFields = PreviewHelper.getColumnFields(
                obj,
                translations
            );

            return columnFields
                ? { ...basicFields, ...columnFields }
                : basicFields;
        });

        if (schema.some((obj: any) => PreviewHelper.isUnsupportedColumn(obj))) {
            setIsAtLeastOneColumnUnsupported(true);
        }

        // rows
        const rows: { [key: string]: any }[] = [];
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

        setDataGridData({
            columns,
            rows,
        });
    }, [record]);

    useEffect(() => {
        if (dataGridData) {
            timer.current = setTimeout(() => {
                setIsSettingUpData(false);
            }, 350);
        }
    }, [dataGridData]);

    return {
        dataGridData,
        isSettingUpData,
        isAtLeastOneColumnUnsupported,
    };
};

type DataGridControllerPrpos = {
    record: any;
    translations: any;
};

type DataGridControllerResult = {
    dataGridData: {
        rows: GridRowsProp;
        columns: GridColDef[];
    } | null;
    isSettingUpData: boolean;
    isAtLeastOneColumnUnsupported: boolean;
};
