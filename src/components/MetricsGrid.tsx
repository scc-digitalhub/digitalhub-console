import { Box, Dialog, Grid, Stack, Typography } from '@mui/material';
import {
    Button,
    Identifier,
    RaRecord,
    useDataProvider,
    useNotify,
    useResourceContext,
    useTranslate,
    useUnselectAll,
} from 'react-admin';
import { useCallback, useEffect, useState } from 'react';
import { useRootSelector } from '@dslab/ra-root-selector';
import { Spinner } from './Spinner';
import { MetricCard, Series } from './MetricCard';
import CompareIcon from '@mui/icons-material/Compare';
import {
    MetricsComparisonSelector,
    SelectorProps,
} from './MetricsComparisonSelector';
import { NoContent } from './NoContent';

/**
 * Format the labels of the given series according to the resource type.
 * Run labels are formatted as: "<run.name> [run.metadata.created]".
 *
 * @param series
 * @param records
 * @param resource
 * @returns
 */
const formatLabels = (
    series: Series[],
    records: RaRecord<Identifier>[],
    resource: string
): Series[] => {
    if (resource === 'runs') {
        return series.map(s => {
            const record = records.find(r => r.id === s.label);
            return {
                ...s,
                label: record
                    ? `${record.name} [${new Date(
                          record.metadata.created
                      ).toLocaleString()}]`
                    : s.label,
            };
        });
    }

    if (resource === 'models') {
        return series.map(s => {
            const record = records.find(r => r.id === s.label);
            return {
                ...s,
                label: record
                    ? `${record.name} [${new Date(
                          record.metadata.created
                      ).toLocaleString()}]`
                    : s.label,
            };
        });
    }

    return series;
};

type MetricsGridProps = SelectorProps & {
    record: RaRecord<Identifier>;
};

export const MetricsGrid = (props: MetricsGridProps) => {
    const { record, ...rest } = props;
    const translate = useTranslate();
    const notify = useNotify();
    const resource = useResourceContext();
    const unselectAll = useUnselectAll(resource);
    const dataProvider = useDataProvider();
    const { root } = useRootSelector();
    const [metricsMap, setMetricsMap] = useState<any>({});
    const [open, setOpen] = useState(false);
    const [compareWith, setCompareWith] = useState<any[]>([]);
    let isLoading1 = false;
    let isLoading2 = false;

    /**
     * Initialize metrics map with metrics of the current record
     * and reset compareWith, in case record changes (i.e. versions)
     */
    useEffect(() => {
        setCompareWith([]);
        setMetricsMap(prev => {
            let value = {};
            if (record.id in prev) {
                value[record.id] = prev[record.id];
            } else if (record?.status?.metrics) {
                value[record.id] = record.status.metrics;
            }
            return value;
        });
    }, [record]);

    /**
     * Read record metrics from the API
     */
    useEffect(() => {
        if (record && dataProvider) {
            isLoading1 = true;
            dataProvider
                .getMetrics(resource, { id: record.id, meta: { root } })
                .then(data => {
                    if (isLoading1) {
                        if (data?.metrics) {
                            setMetricsMap(prev => {
                                const value = { ...prev };
                                if (Object.keys(data.metrics).length !== 0) {
                                    value[record.id] = data.metrics;
                                }
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

            return () => {
                isLoading1 = false;
            };
        }
    }, [dataProvider, notify, record, resource, root]);

    /**
     * Update metrics map with metrics of comparison records,
     * fetching each one from the API,
     * whenever the list of records to compare with is updated
     */
    useEffect(() => {
        if (dataProvider && compareWith.length > 0) {
            isLoading2 = true;
            //for each id, if !metricsMap[id] then call API
            const toBeAdded = compareWith.filter(r => !(r.id in metricsMap));
            const promises = toBeAdded.map(t =>
                dataProvider.getMetrics(resource, { id: t.id, meta: { root } })
            );

            Promise.all(promises)
                .then(values => {
                    if (isLoading2) {
                        let newMetrics = {};
                        values.forEach((v, index) => {
                            if (v?.metrics) {
                                newMetrics[toBeAdded[index].id] = v?.metrics;
                            }
                        });
                        setMetricsMap(prev => {
                            let prevsToKeep = {};
                            Object.keys(prev).forEach(p => {
                                if (
                                    p == record.id ||
                                    compareWith.some(v => v.id == p)
                                ) {
                                    prevsToKeep[p] = prev[p];
                                }
                            });
                            return { ...prevsToKeep, ...newMetrics };
                        });
                    }
                })
                .catch(error => {
                    const e =
                        typeof error === 'string'
                            ? error
                            : error.message || 'error';
                    notify(e);
                });

            return () => {
                isLoading2 = false;
            };
        } else {
            //compareWith has been emptied, reset metricsMap
            setMetricsMap(prev => {
                let prevsToKeep = {};
                if (prev[record.id]) {
                    prevsToKeep[record.id] = prev[record.id];
                }
                return prevsToKeep;
            });
        }
    }, [compareWith]);

    const mergedMetrics = mergeData(metricsMap);

    const grid =
        Object.keys(metricsMap).length !== 0 ? (
            <Grid container spacing={2} sx={{ paddingY: '16px' }}>
                {mergedMetrics &&
                    Object.entries(mergedMetrics).map(
                        ([metricName, series]: [string, any], index) => (
                            <Grid item xs={12} md={4} key={'metric_' + index}>
                                <MetricCard
                                    metric={{
                                        name: metricName,
                                        series: formatLabels(
                                            series,
                                            [record, ...compareWith],
                                            resource
                                        ),
                                    }}
                                    comparison={compareWith.length > 0}
                                />
                            </Grid>
                        )
                    )}
            </Grid>
        ) : (
            <NoContent message={'fields.info.empty'} />
        );

    const handleDialogOpen = e => {
        e.stopPropagation();
        setOpen(true);
    };

    const handleDialogClose = e => {
        e.stopPropagation();
        setOpen(false);
        unselectAll();
    };

    const handleClick = useCallback(e => {
        e.stopPropagation();
    }, []);

    const startComparison = (records: any[]) => {
        setOpen(false);
        setCompareWith(records);
        unselectAll();
    };

    const getCurrentlySelected = () => {
        return compareWith;
    };

    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Typography variant="h6" gutterBottom>
                    {translate('fields.metrics.title')}
                </Typography>
                {Object.keys(metricsMap).length !== 0 && (
                    <Button
                        label="actions.compare"
                        onClick={handleDialogOpen}
                        color="info"
                        variant="contained"
                    >
                        <CompareIcon />
                    </Button>
                )}
            </Stack>
            <Dialog
                open={open}
                onClose={handleDialogClose}
                onClick={handleClick}
                fullWidth
                maxWidth="md"
                sx={{
                    '& .MuiDialog-paper': {
                        paddingX: '24px',
                    },
                }}
            >
                <MetricsComparisonSelector
                    startComparison={startComparison}
                    close={handleDialogClose}
                    getCurrentlySelected={getCurrentlySelected}
                    {...rest}
                />
            </Dialog>

            {isLoading1 ? <Spinner /> : grid}
        </Box>
    );
};

const mergeData = (input: any) => {
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
