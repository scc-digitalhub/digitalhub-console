import {
    Box,
    Grid,
    Typography,
} from '@mui/material';
import {
    useDataProvider,
    useNotify,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { useEffect, useState } from 'react';
import { useRootSelector } from '@dslab/ra-root-selector';
import { Spinner } from './Spinner';
import { MetricCard } from './MetricCard';

// a set of values related to a specific metric, ex: {label:'v1',data:1},{label:'v2',data:[1,2,3]}
export type Series = {
    data: any;
    label: string;
};

// all sets of values related to a specific metric, ex: {name:'accuracy',series:[{label:'v1',data:1},{label:'v2',data:[1,2,3]}]}
export type Metric = {
    name: string;
    series: Series[];
};

export const MetricsGrid = (props: { record: any }) => {
    const { record } = props;
    const translate = useTranslate();
    const notify = useNotify();
    const resource = useResourceContext();
    const dataProvider = useDataProvider();
    const { root } = useRootSelector();
    const [metricsMap, setMetricsMap] = useState<any>({});
    let isLoading = false;

    /**
     * Initialize metrics map with metrics of the current record,
     * either getting them from the record or from the API
     */
    useEffect(() => {
        isLoading = true;
        if (record && dataProvider) {
            //TODO verify path
            if (record.status?.metrics) {
                if (isLoading) {
                    setMetricsMap(prev => {
                        const value = { ...prev };
                        value[record.id] = record.status.metrics;
                        return value;
                    });
                }
            } else {
                dataProvider
                    .getMetrics(resource, { id: record.id, meta: { root } })
                    .then(data => {
                        if (isLoading) {
                            if (data?.metrics) {
                                setMetricsMap(prev => {
                                    const value = { ...prev };
                                    value[record.id] = data.metrics;
                                    return value;
                                });
                            } else {
                                notify('ra.message.not_found', {
                                    type: 'error',
                                });
                            }
                        }
                    })
                    .catch(error => {
                        const e =
                            typeof error === 'string'
                                ? error
                                : error.message || 'error';
                        notify(e);
                    });
            }

            return () => {
                isLoading = false;
            };
        }
    }, [dataProvider, notify, record, resource, root]);

    //TODO memoize?
    const mergedMetrics = mergedData2(metricsMap);

    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            <Typography variant="h6" gutterBottom>
                {translate('resources.models.metrics.title')}
            </Typography>

            {isLoading ? (
                <Spinner />
            ) : (
                <Grid container spacing={2} sx={{ paddingY: '16px' }}>
                    {mergedMetrics &&
                        Object.entries(mergedMetrics).map(
                            ([metricName, series]: [string, any], index) => (
                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                    key={'metric_' + index}
                                >
                                    <MetricCard
                                        metric={{
                                            name: metricName,
                                            series: series,
                                        }}
                                    />
                                </Grid>
                            )
                        )}
                </Grid>
            )}
        </Box>
    );
};

const mergedData = (versions: any[]) => {
    //[{name:'accuracy',series:[{label:'v1',data:1},{label:'v2',data:[1,2,3]}]},{name:'loss',series:[{label:'v1',data:1},{label:'v2',data:[1,2,3]}]}]
    let merged: any[] = [];
    if (versions && versions.length > 0) {
        versions.forEach((version, index) => {
            Object.keys(version).forEach(key => {
                if (merged.filter(item => item.name === key).length === 0) {
                    let obj = {
                        name: key,
                        series: [{ label: index + '', data: version[key] }],
                    };
                    merged.push(obj);
                } else {
                    merged[
                        merged.findIndex(item => item.name === key)
                    ].series.push({ label: index + '', data: version[key] });
                }
            });
        });
    }
    return merged;
};

const mergedData2 = (input: any) => {
    let merged = {};
    Object.entries(input).forEach(([id, metricsSet]: [string, any]) => {
        Object.keys(metricsSet).forEach(metricName => {
            if (metricName in merged) {
                merged[metricName].push({
                    label: id,
                    data: metricsSet[metricName],
                });
            } else {
                merged[metricName] = [
                    { label: id, data: metricsSet[metricName] },
                ];
            }
        });
    });

    return merged;
};
