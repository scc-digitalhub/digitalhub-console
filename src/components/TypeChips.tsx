// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Identifier,
    RaRecord,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import get from 'lodash/get';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const TypeChips = (props: {
    resource?: string;
    record?: RaRecord<Identifier>;
    source: string;
    label?: string;
    sortable?: boolean;
}) => {
    const { source, ...rest } = props;
    const translate = useTranslate();
    const theme = useTheme();
    const record = useRecordContext(rest);
    const raw = get(record, source);

    if (!record || !raw) {
        return <></>;
    }

    const value = String(raw);

    const translated = translate(value.toLowerCase(), { _: value });

    const TypeColors: Record<string, string> = {
        Ready: 'info',
        Initialized: 'warning',
        PodReadyToStartContainers: 'success',
        ContainersReady: 'secondary',
        PodScheduled: 'default',
    };

    const colorKey = TypeColors[value] || 'grey';

    const paletteEntry =
        (theme.palette as any)[colorKey] ||
        theme.palette[colorKey as keyof typeof theme.palette];
    const bgColor =
        typeof paletteEntry === 'object' &&
        paletteEntry &&
        'main' in paletteEntry
            ? paletteEntry.main
            : typeof paletteEntry === 'string'
            ? paletteEntry
            : theme.palette.text.primary;

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
                sx={{
                    width: 15,
                    height: 15,
                    borderRadius: '50%',
                    bgcolor: bgColor,
                    mr: 1,
                    flex: '0 0 auto',
                }}
            />
            <Typography variant="body2" sx={{ lineHeight: 1 }}>
                {translated}
            </Typography>
        </Box>
    );
};
