import { GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { useEffect, useRef, useState } from 'react';
import { useTranslate } from 'react-admin';

export const useDataGridController = (props: {
    fields: any;
}): DataGridControllerResult => {
    const { fields = {} } = props;
    const translate = useTranslate();

    const [data, setData] = useState<{
        rows: GridRowsProp;
        columns: GridColDef[];
    } | null>(null);
    const isLoading = useRef<boolean>(false);

    const baseColumns: GridColDef[] = [
        {
            field: 'key',
            headerName: translate('fields.datagrid.key'),
            flex: 0.5,
        },
        {
            field: 'value',
            headerName: translate('fields.datagrid.value'),
            flex: 1,
        },
    ];

    useEffect(() => {
        isLoading.current = true;

        if (fields) {
            const columns = [...baseColumns];

            //rows
            const rows: any = [];
            let index = 0;
            for (const [key, value] of Object.entries(fields)) {
                rows.push({
                    id: index,
                    key,
                    value,
                });
                index++;
            }

            setData({
                rows,
                columns,
            });
        } else {
            setData({ rows: [], columns: baseColumns });
        }

        isLoading.current = false;
    }, [fields]);

    return {
        data: data,
        isLoading: isLoading.current,
    };
};

type DataGridControllerResult = {
    data: {
        rows: GridRowsProp;
        columns: GridColDef[];
    } | null;
    isLoading: boolean;
};
