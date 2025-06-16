// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { GridColDef, GridRowsProp } from '@mui/x-data-grid';
import inflection from 'inflection';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslate } from 'react-admin';

export const useSchemaDataGridController = (props: {
    schema: any;
}): SchemaDataGridControllerResult => {
    const { schema } = props;
    const translate = useTranslate();

    const [data, setData] = useState<{
        rows: GridRowsProp;
        columns: GridColDef[];
    } | null>(null);
    const isLoading = useRef<boolean>(false);

    const fields = useMemo(() => {
        return schema?.fields && schema.fields instanceof Array
            ? schema.fields
            : [];
    }, [schema]);

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

    useEffect(() => {
        isLoading.current = true;

        if (fields && fields.length > 0) {
            // columns
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
            const rows = fields.map((obj: any, i: number) => ({
                id: i,
                ...obj,
            }));

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

type SchemaDataGridControllerResult = {
    data: {
        rows: GridRowsProp;
        columns: GridColDef[];
    } | null;
    isLoading: boolean;
};
