// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Stack, Box } from '@mui/system';
import { MetricBadge, MetricProps } from './MetricBadge';
import { useResourceMetrics } from './useResourceMetrics';
import { formatMetricsValue } from './utils';
export const MetricsField = (
    props: Omit<MetricProps, 'value' | 'name' | 'icon' | 'title'> & {
        record?: any;
    } & {
        icon?: false;
        labels?: boolean;
        metrics?: string[] | boolean;
    }
) => {
    const {
        metrics: metricsKeys = ['cpu', 'memory', 'disk'],
        icon,
        labels = false,
        size,
        fontSize,
        gap = 0,
        ...rest
    } = props;
    const { metrics } = useResourceMetrics(props);

    if (!metrics || !metrics.metrics || metrics.metrics.length === 0) {
        return null;
    }

    return (
        <Stack
            direction={'row'}
            gap={gap}
            alignItems="center"
            sx={{
                display: 'inline-grid',
                gridAutoFlow: 'column',
                gridAutoColumns: '1fr',
            }}
        >
            {metrics.metrics
                .filter(e =>
                    Array.isArray(metricsKeys)
                        ? metricsKeys.includes(e.name)
                        : metricsKeys
                )
                .map(e => ({
                    name: e.name,
                    value: e.summary?.find(s => s.name == 'avg')?.value,
                }))
                .map(e => (
                    <Box key={e.name} sx={{ textAlign: 'center' }} data-value={e.value}>
                        <MetricBadge
                            name={e.name}
                            value={formatMetricsValue(e.name, e.value)}
                            icon={icon === false ? false : undefined}
                            size={size ? size : 'large'}
                            fontSize={fontSize ? fontSize : 'medium'}
                            title={
                                labels === false
                                    ? false
                                    : `fields.k8s.resources.${e.name}.title`
                            }
                            {...rest}
                        />
                    </Box>
                ))}
        </Stack>
    );
};
