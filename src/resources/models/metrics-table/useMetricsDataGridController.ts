import { GridColDef, GridRowsProp } from '@mui/x-data-grid';
import inflection from 'inflection';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslate } from 'react-admin';

export const useMetricsDataGridController = (props: {
    metrics: any;
}): MetricsDataGridControllerResult => {
    const { metrics = {} } = props;
    const translate = useTranslate();

    const [data, setData] = useState<{
        rows: GridRowsProp;
        columns: GridColDef[];
    } | null>(null);
    const isLoading = useRef<boolean>(false);

    const baseColumns: GridColDef[] = [
        {
            field: 'key',
            headerName: translate('resources.models.metrics.key'),
            flex: 1,
        },
        {
            field: 'value',
            headerName: translate('resources.models.metrics.value'),
            flex: 1,
        },
    ];

    useEffect(() => {
        isLoading.current = true;

        if (metrics) {
            const columns = [...baseColumns];

            //rows
            const rows: any = [];
            let index = 0;
            for (const [key, value] of Object.entries(metrics)) {
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
    }, [metrics]);

    return {
        data: data,
        isLoading: isLoading.current,
    };
};

type MetricsDataGridControllerResult = {
    data: {
        rows: GridRowsProp;
        columns: GridColDef[];
    } | null;
    isLoading: boolean;
};
