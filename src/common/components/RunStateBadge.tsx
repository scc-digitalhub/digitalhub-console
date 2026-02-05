// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Chip, SxProps, Theme } from '@mui/material';
import { useMemo } from 'react';
import {
    useCreatePath,
    useGetList,
    useRecordContext,
    useResourceContext,
} from 'react-admin';
import { StateColors } from './StateChips';
import { useNavigate } from 'react-router-dom';
import { FUNCTION_OR_WORKFLOW } from '../utils/helpers';

export type RunStateBadgeProps = {
    state?: string;
    filterById?: boolean;
    sx?: SxProps<Theme>;
    getListFilters?: any;
};

export const RunStateBadge = (props: RunStateBadgeProps) => {
    const {
        state = 'RUNNING',
        filterById = true,
        sx: sxProps = {},
        getListFilters: additionalFilters = {},
    } = props;
    const createPath = useCreatePath();
    const navigate = useNavigate();
    const resource = useResourceContext();
    const record = useRecordContext();
    const MAX = 99;

    const resourceKey = useMemo(() => {
        if (record) {
            let key = `${record.kind}://${record.project}/${record.name}`;
            if (filterById) key += `:${record.id}`;
            return key;
        }
    }, [filterById, record]);

    const singularResource = resource?.substring(0, resource.length - 1);

    const { total, isPending } = useGetList('runs', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
        filter: {
            [singularResource || '']: resourceKey,
            state,
            ...additionalFilters,
        },
    });

    if (isPending || !total) return null;

    const handleClick = (event, state: string) => {
        event.stopPropagation();
        event.preventDefault();

        let filter = { state };
        if (singularResource && resourceKey)
            filter[FUNCTION_OR_WORKFLOW] = `${singularResource}_${
                filterById
                    ? resourceKey.replace(`:${record?.id}`, '')
                    : resourceKey
            }`;
        const link =
            createPath({ type: 'list', resource: 'runs' }) +
            '?filter=' +
            encodeURIComponent(JSON.stringify(filter));

        navigate(link);
    };

    return (
        <Chip
            color={StateColors[state]}
            size="small"
            label={total <= MAX ? total : `${MAX}+`}
            onClick={e => handleClick(e, state)}
            sx={{
                '.MuiChip-label': {
                    fontSize: '12px',
                    lineHeight: '12px',
                    paddingX: '6px',
                },
                height: '20px',
                ...sxProps,
            }}
        />
    );
};
