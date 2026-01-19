// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Box,
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Stack,
    styled,
    Typography,
    useTheme,
} from '@mui/material';
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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRootSelector } from '@dslab/ra-root-selector';
import { MetricCard } from './MetricCard';
import CompareIcon from '@mui/icons-material/Compare';
import CloseIcon from '@mui/icons-material/Close';
import {
    MetricsComparisonSelector,
    SelectorProps,
} from './MetricsComparisonSelector';
import {
    chartPalette,
    formatLabel,
    formatLabels,
    mergeData,
    Series,
} from '../utils';
import { CreateInDialogButtonClasses } from '@dslab/ra-dialog-crud';
import { NoContent } from '../../../common/components/layout/NoContent';
import { Spinner } from '../../../common/components/layout/Spinner';

type MetricsGridProps = SelectorProps & {
    record: RaRecord<Identifier>;
};

export const MetricsGrid = (props: MetricsGridProps) => {
    const { record, ...rest } = props;
    const translate = useTranslate();
    const theme = useTheme();
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
     * and reset comparison
     */
    useEffect(() => {
        setCompareWith([]);
        setMetricsMap(prev => {
            let value = {};
            if (record.id in prev) {
                value[record.id] = prev[record.id];
            } else if (
                record?.status?.metrics &&
                Object.keys(record?.status?.metrics).length !== 0
            ) {
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
        if (dataProvider) {
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
        }
    }, [compareWith]);

    const mergedMetrics = useMemo(() => mergeData(metricsMap), [metricsMap]);

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

    const removeFromComparison = r => {
        setCompareWith(prev => {
            return prev.filter(p => p.id != r.id);
        });
    };

    if (!resource) return <></>;

    const grid =
        Object.keys(metricsMap).length !== 0 ? (
            <Grid container spacing={2} sx={{ paddingY: '16px' }}>
                {mergedMetrics &&
                    Object.entries(mergedMetrics).map(
                        ([metricName, series]: [string, Series[]], index) => (
                            <Grid
                                size={{ xs: 12, md: 4 }}
                                key={'metric_' + index}
                            >
                                <MetricCard
                                    metric={{
                                        name: metricName,
                                        series: formatLabels(
                                            sortRecordFirst(
                                                series,
                                                record.id.toString()
                                            ),
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
            <ComparisonDialog
                open={open}
                onClose={handleDialogClose}
                onClick={handleClick}
                fullWidth
                maxWidth="md"
                aria-labelledby="metrics-grid-dialog"
                className={CreateInDialogButtonClasses.dialog}
            >
                <div className={CreateInDialogButtonClasses.header}>
                    <DialogTitle
                        id="metrics-grid-dialog-title"
                        className={CreateInDialogButtonClasses.title}
                    >
                        {translate('messages.metrics.comparison_title', {
                            id: record?.id,
                        })}
                    </DialogTitle>
                    <IconButton
                        className={CreateInDialogButtonClasses.closeButton}
                        aria-label={translate('ra.action.close')}
                        title={translate('ra.action.close')}
                        onClick={handleDialogClose}
                        size="small"
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </div>
                <DialogContent>
                    <MetricsComparisonSelector
                        startComparison={startComparison}
                        close={handleDialogClose}
                        getCurrentlySelected={getCurrentlySelected}
                        {...rest}
                    />
                </DialogContent>
            </ComparisonDialog>
            <Box>
                <Chip
                    label={formatLabel(record, resource)}
                    variant="outlined"
                    sx={{
                        mr: '5px',
                        mb: '5px',
                        borderColor: chartPalette(theme.palette.mode)[0],
                    }}
                />
                {compareWith.length > 0 &&
                    compareWith
                        .toSorted((a, b) => {
                            if (a.id.toString() < b.id.toString()) return -1;
                            if (a.id.toString() > b.id.toString()) return 1;
                            return 0;
                        })
                        .map((r, i) => (
                            <Chip
                                key={'compare-chip-' + r.id}
                                label={formatLabel(r, resource)}
                                variant="outlined"
                                sx={{
                                    mr: '5px',
                                    mb: '5px',
                                    borderColor: chartPalette(
                                        theme.palette.mode
                                    )[i + 1],
                                }}
                                onDelete={() => removeFromComparison(r)}
                            />
                        ))}
            </Box>

            {isLoading1 ? <Spinner /> : grid}
        </Box>
    );
};

const sortRecordFirst = (arr: Series[], recordId: string): any[] => {
    const sorted = arr.filter(s => s.label == recordId);
    const rest = arr
        .filter(s => s.label != recordId)
        .toSorted((a, b) => {
            if (a.label < b.label) return -1;
            if (a.label > b.label) return 1;
            return 0;
        });
    return [...sorted, ...rest];
};

const ComparisonDialog = styled(Dialog, {
    name: 'RaCreateInDialogButton',
    overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${CreateInDialogButtonClasses.title}`]: {
        padding: theme.spacing(0),
    },
    [`& .${CreateInDialogButtonClasses.header}`]: {
        padding: theme.spacing(2, 2, 0),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    [`& .${CreateInDialogButtonClasses.closeButton}`]: {
        height: 'fit-content',
    },
}));
