// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
    RaRecord,
    useDataProvider,
    useRecordContext,
    useResourceContext,
} from 'react-admin';

export type UseResourceMetricsProps = {
    record?: RaRecord;
    resource?: string;
    refreshInterval?: number;
};

export const useResourceMetrics = (props?: UseResourceMetricsProps) => {
    const { refreshInterval = 30000 } = props ?? {};
    const resource = useResourceContext(props);
    const dataProvider = useDataProvider();
    const record = useRecordContext(props);
    const recordId = record?.id;
    const { root: projectId } = useRootSelector();
    const [metrics, setMetrics] = useState<any>(undefined);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchMetrics = useCallback(() => {
        if (dataProvider && recordId && resource) {
            const url =
                projectId && resource !== 'projects' && resource !== 'users'
                    ? `/-/${projectId}/${resource}/${recordId}/resource_metrics`
                    : `/${resource}/${recordId}/resource_metrics`;

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
    }, [dataProvider, projectId, recordId, resource]);

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);

    useEffect(() => {
        if (!refreshInterval) return;
        intervalRef.current = setInterval(() => {
            fetchMetrics();
        }, refreshInterval);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [fetchMetrics, refreshInterval]);

    return { metrics, refresh: fetchMetrics };
};

export const useListResourceMetrics = (props?: UseResourceMetricsProps) => {
    console.log('useListResourceMetrics props', props);
    const { refreshInterval = 30000 } = props ?? {};
    const resource = useResourceContext(props);
    const dataProvider = useDataProvider();
    const record = useRecordContext(props);
    const recordId = record?.id;
    console.log('record', record);
    const { root: projectId } = useRootSelector();
    const [metrics, setMetrics] = useState<any[] | undefined>(undefined);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchMetrics = useCallback(() => {
        if (dataProvider && recordId && resource) {
            const url = projectId
                ? `/-/${projectId}/resource_metrics/${resource}/${recordId}`
                : `/resource_metrics/${resource}/${recordId}`;

            dataProvider
                .invoke({
                    path: url,
                    options: { method: 'GET' },
                })
                .then(res => {console.log('res', res);
                    if (res) {
                        setMetrics(res);
                    }
                });
        }
    }, [dataProvider, projectId, recordId, resource]);

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);

    useEffect(() => {
        if (!refreshInterval) return;
        intervalRef.current = setInterval(() => {
            fetchMetrics();
        }, refreshInterval);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [fetchMetrics, refreshInterval]);

    return { metrics, refresh: fetchMetrics };
};
