import { Box, Dialog, Grid, Stack, Typography } from '@mui/material';
import {
    Button,
    useDataProvider,
    useNotify,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { useCallback, useEffect, useState } from 'react';
import { useRootSelector } from '@dslab/ra-root-selector';
import { Spinner } from './Spinner';
import { MetricCard } from './MetricCard';
import CompareIcon from '@mui/icons-material/Compare';
import { MetricsComparisonSelector } from './MetricsComparisonSelector';
import { functionParser } from '../common/helper';

export const MetricsGrid = (props: { record: any }) => {
    const { record } = props;
    const translate = useTranslate();
    const notify = useNotify();
    const resource = useResourceContext();
    const dataProvider = useDataProvider();
    const { root } = useRootSelector();
    const [metricsMap, setMetricsMap] = useState<any>({});
    const [open, setOpen] = useState(false);
    const [compareWith, setCompareWith] = useState<string[]>([]);
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

    /**
     * Update metrics map with metrics of comparison records,
     * fetching each one from the API,
     * whenever the list of IDs to compare with is updated
     */
    useEffect(() => {
        console.log('compareWith now is', compareWith.join());
        isLoading = true;
        if (dataProvider) {
            //for each id, if !metricsMap[id] then call API
            const toBeAdded = compareWith.filter(id => !(id in metricsMap));
            const promises = toBeAdded.map(id =>
                dataProvider.getMetrics(resource, { id, meta: { root } })
            );

            Promise.all(promises)
                .then(values => {
                    console.log('results', values);
                    let newMetrics = {};
                    values.forEach((v, index) => {
                        if (v?.metrics) {
                            newMetrics[toBeAdded[index]] = v?.metrics;
                        }
                    });
                    setMetricsMap(prev => {
                        let prevsToKeep = {};
                        Object.keys(prev).forEach(p => {
                            if (p == record.id || compareWith.includes(p)) {
                                prevsToKeep[p] = prev[p];
                            }
                        });
                        return { ...prevsToKeep, ...newMetrics };
                    });
                })
                .catch(error => {
                    const e =
                        typeof error === 'string'
                            ? error
                            : error.message || 'error';
                    notify(e);
                });

            return () => {
                isLoading = false;
            };
        }
    }, [compareWith]);

    //TODO memoize?
    const mergedMetrics = mergedData2(metricsMap);

    const handleDialogOpen = e => {
        e.stopPropagation();
        setOpen(true);
    };

    const handleDialogClose = e => {
        e.stopPropagation();
        setOpen(false);
    };

    const handleClick = useCallback(e => {
        e.stopPropagation();
    }, []);

    const startComparison = (ids: string[]) => {
        setOpen(false);
        setCompareWith(ids);
    };

    const getPreviousAndClose = () => {
        setOpen(false);
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
                    {translate('resources.models.metrics.title')}
                </Typography>
                <Button
                    label="actions.compare"
                    onClick={handleDialogOpen}
                    color="info"
                    variant="contained"
                >
                    <CompareIcon />
                </Button>
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
                    getPreviousAndClose={getPreviousAndClose}
                    functionName={functionParser(record?.spec?.function).functionName}
                />
            </Dialog>

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
                                        comparison={compareWith.length > 0}
                                    />
                                </Grid>
                            )
                        )}
                </Grid>
            )}
        </Box>
    );
};

// const mergedData = (versions: any[]) => {
//     //[{name:'accuracy',series:[{label:'v1',data:1},{label:'v2',data:[1,2,3]}]},{name:'loss',series:[{label:'v1',data:1},{label:'v2',data:[1,2,3]}]}]
//     let merged: any[] = [];
//     if (versions && versions.length > 0) {
//         versions.forEach((version, index) => {
//             Object.keys(version).forEach(key => {
//                 if (merged.filter(item => item.name === key).length === 0) {
//                     let obj = {
//                         name: key,
//                         series: [{ label: index + '', data: version[key] }],
//                     };
//                     merged.push(obj);
//                 } else {
//                     merged[
//                         merged.findIndex(item => item.name === key)
//                     ].series.push({ label: index + '', data: version[key] });
//                 }
//             });
//         });
//     }
//     return merged;
// };

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
