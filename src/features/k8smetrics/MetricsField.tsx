import { useRootSelector } from '@dslab/ra-root-selector';
import { Stack, Box } from '@mui/system';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
    useRecordContext,
    useDataProvider,
    useResourceContext,
} from 'react-admin';
import { MetricBadge, MetricProps } from './MetricBadge';
import { formatMetricsValue } from './utils';

export const MetricsField = (
    props: Omit<MetricProps, 'value' | 'name' | 'icon' | 'title'> & {
        record?: any;
    } & { icon?: false; labels?: boolean; metrics?: string[] | boolean }
) => {
    const {
        metrics: metricsKeys = ['cpu', 'memory', 'disk'],
        icon,
        labels = false,
        size,
        fontSize,
        gap = 1,
        ...rest
    } = props;
    const resource = useResourceContext();
    const record = useRecordContext(props);
    const dataProvider = useDataProvider();
    const { root: projectId } = useRootSelector();

    const [metrics, setMetrics] = useState<any>();
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchMetrics = useCallback(() => {
        console.log('Fetching metrics for', resource, record?.id);
        if (dataProvider && record && resource) {
            const url =
                projectId && resource !== 'projects'
                    ? `/-/${projectId}/${resource}/${record.id}/metrics/k8s`
                    : `/${resource}/${record.id}/metrics/k8s`;

            dataProvider
                .invoke({
                    path: url,
                    options: { method: 'GET' },
                })
                .then(res => {
                    if (res) {
                        setMetrics(res);
                    }
                });
        }
    }, [dataProvider, projectId, record, resource]);

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

    if (!metrics || !metrics.usage || Object.keys(metrics.usage).length === 0) {
        return null;
    }

    return (
        <Stack direction={'row'} gap={gap}>
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
                            {...rest}
                        />
                    </Box>
                ))}
        </Stack>
    );
};
