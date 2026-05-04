// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    ChipField,
    Identifier,
    RaRecord,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import get from 'lodash/get';
import { Chip, Stack, styled, Typography } from '@mui/material';

export const StateChips = (props: {
    resource?: string;
    record?: RaRecord<Identifier>;
    source: string;
    label?: string;
    sortable?: boolean;
    size?: 'medium' | 'small';
    variant?: 'filled' | 'compact';
}) => {
    const { source, size = 'medium', variant = 'filled', ...rest } = props;
    const translate = useTranslate();
    const record = useRecordContext(rest);
    const value = get(record, source)?.toString().toUpperCase();
    if (!record || !value) {
        return <></>;
    }

    const r = {
        value: translate('states.' + value.toLowerCase()).toUpperCase(),
    };

    return variant === 'compact' ? (
        <Stack direction="row" gap={0.5}>
            <RoundChip color={StateColors[value]} size={size} />
            <Typography
                variant="body2"
                color={StateColors[value]}
                fontWeight="medium"
                fontSize={size == 'medium' ? '110%' : '100%'}
            >
                {value}
            </Typography>
        </Stack>
    ) : (
        <ChipField
            record={r}
            source="value"
            color={StateColors[value]}
            size={size}
        />
    );
};

const RoundChip = styled(Chip, {
    name: 'RoundChip',
    overridesResolver: (props, styles) => styles.root,
})({
    borderRadius: '50%',
    aspectRatio: '1 / 1',
    minWidth: 0,
    padding: 0,
    maxWidth: '70%',
    maxHeight: '70%',
    '& .MuiChip-label': { display: 'none' },
});

export enum StateColors {
    BUILT = 'warning',
    COMPLETED = 'success',
    CREATED = 'default',
    DELETED = 'secondary',
    DELETING = 'warning',
    ERROR = 'error',
    PENDING = 'warning',
    READY = 'success',
    RUNNING = 'info',
    STOP = 'warning',
    STOPPED = 'warning',
    SUCCEEDED = 'success',
    UPLOADING = 'info',
}
