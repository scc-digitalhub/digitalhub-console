import { GridColDef, GridRowsProp } from '@mui/x-data-grid';
import inflection from 'inflection';
import { useEffect, useRef, useState } from 'react';
import { useTranslate } from 'react-admin';

export const useSchemaDataGridController = (props: {
    schema?: any;
}): SchemaDataGridControllerResult => {
    const { schema = {} } = props;
    const translate = useTranslate();

    const [data, setData] = useState<{
        rows: GridRowsProp;
        columns: GridColDef[];
    } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const timer = useRef<any>(null);

    useEffect(() => {
        clearTimeout(timer.current);
        setIsLoading(true);

        const fields = schema?.fields || [];

        // columns
        const baseColumns: GridColDef[] = [
            {
                field: 'name',
                headerName: translate('resources.dataitems.schema.name'),
                flex: 1,
            },
            {
                field: 'type',
                headerName: translate('resources.dataitems.schema.type'),
                flex: 1,
            },
        ];

        const dynamicColumns = fields.reduce(
            (acc: GridColDef[], columnDescriptor: any) => {
                const filteredKeys = Object.keys(columnDescriptor).filter(
                    key => key !== 'name' && key !== 'type'
                );

                filteredKeys.forEach(key => {
                    if (!acc.some(r => r.field === key)) {
                        const label = inflection.transform(
                            key.replace(/\./g, ' '),
                            ['underscore', 'humanize']
                        );

                        acc.push({
                            field: key,
                            headerName: label,
                            flex: 1,
                        });
                    }
                });
                return acc;
            },
            []
        );

        const columns = [...baseColumns, ...dynamicColumns];

        //rows
        const rows = fields.map((obj: any, i: number) => ({ id: i, ...obj }));

        setData({
            rows,
            columns,
        });
    }, [schema]);

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
    };
};

type SchemaDataGridControllerResult = {
    data: {
        rows: GridRowsProp;
        columns: GridColDef[];
    } | null;
    isLoading: boolean;
};
