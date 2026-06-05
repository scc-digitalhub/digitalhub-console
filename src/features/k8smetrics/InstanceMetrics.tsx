// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Stack, Box } from '@mui/system';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useDataProvider } from 'react-admin';
import { MetricProps, MetricBadge } from './MetricBadge';
import { formatMetricsValue } from './utils';

const defaultMetrics = ['cpu', 'memory', 'disk'];

export const InstanceMetrics = (
    props: Omit<MetricProps, 'value' | 'name' | 'icon' | 'title'> & {
        record?: any;
    } & {
        icon?: false;
        labels?: boolean;
        metrics?: string[] | boolean;
    }
) => {
    const {
        metrics: metricsKeys = defaultMetrics,
        icon,
        labels = true,
        size = 'small',
        fontSize,
        gap = 1,
        ...rest
    } = props;

    const dataProvider = useDataProvider();
    const [metrics, setMetrics] = useState<any>();
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchMetrics = useCallback(() => {
        if (dataProvider) {
            const url = '/metrics/k8s';
            dataProvider
                .invoke({
                    path: url,
                    options: { method: 'GET' },
                })
                .then(res => {
                    console.log('Fetched metrics', res);
                    if (res?.usage && Object.keys(res.usage).length > 0) {
                        //if default metrics is missing add them with null value
                        const completeMetrics = {
                            usage: Object.fromEntries(
                                (Array.isArray(metricsKeys)
                                    ? metricsKeys
                                    : defaultMetrics
                                ).map(key => [
                                    key,
                                    res.usage[key] !== undefined
                                        ? res.usage[key]
                                        : null,
                                ])
                            ),
                        };
                        setMetrics(completeMetrics);
                    } else {
                        //if no res, set empty metrics
                        setMetrics({
                            usage: Object.fromEntries(
                                (Array.isArray(defaultMetrics)
                                    ? defaultMetrics
                                    : []
                                ).map(key => [key, null])
                            ),
                        });
                    }
                });
        }
    }, [dataProvider]);

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            fetchMetrics();
        }, 30000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [fetchMetrics]);
    console.log('InstanceMetrics render', metrics);
    if (!metrics || !metrics.usage || Object.keys(metrics.usage).length === 0) {
        return null;
    }

    return (
        <Stack
            direction={'row'}
            gap={gap}
            alignItems="right"
            sx={{
                display: 'flex',
                gridAutoFlow: 'column',
                gridAutoColumns: '1fr',
            }}
        >
            {Object.entries(metrics.usage)
                .filter(([key]) =>
                    Array.isArray(metricsKeys)
                        ? metricsKeys.includes(key)
                        : metricsKeys
                )
                .map(([key, value]) => (
                    <Box key={key} sx={{ textAlign: 'center' }}>
                        <MetricBadge
                            name={key}
                            value={formatMetricsValue(key, value)}
                            icon={icon === false ? false : undefined}
                            size={size ? size : 'large'}
                            fontSize={fontSize ? fontSize : 'medium'}
                            title={
                                labels === false
                                    ? false
                                    : `fields.k8s.resources.${key}.title`
                            }
                            direction="row-reverse"
                            gap={1}
                            {...rest}
                        />
                    </Box>
                ))}
        </Stack>
    );
};
