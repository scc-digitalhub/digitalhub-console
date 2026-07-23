// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useState, useRef, RefObject, FC } from 'react';
import {
    LoadingIndicator,
    useGetResourceLabel,
    Identifier,
    IconButtonWithTooltip,
    useTranslate,
    RaRecord,
    TextField,
    Labeled,
    RecordContext,
    RecordContextProvider,
    FunctionField,
} from 'react-admin';
import {
    Box,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography,
    useTheme,
} from '@mui/material';
import { axisClasses, LineChart } from '@mui/x-charts';
import { formatTimeTick } from '../../common/utils/helpers';
import DownloadIcon from '@mui/icons-material/FileDownload';
import { toPng } from 'html-to-image';
import {
    useListResourceMetrics,
    UseResourceMetricsProps,
} from './useResourceMetrics';
import { IdField } from '../../common/components/fields/IdField';
import { formatMetricsValue } from './utils';

const MetricsSeriesChart = ({ metrics }: { metrics: any[] }) => {
    const chartRef = useRef<HTMLDivElement>(null);

    const dataset = useMemo(() => {
        if (!metrics || metrics.length === 0) return [];

        const pointMap = new Map<
            number,
            Record<string, number | null> & { time: number }
        >();

        const toMs = (ts: number) => (ts < 1e10 ? ts * 1000 : ts);

        for (const m of metrics) {
            for (const p of m.metrics ?? []) {
                const ts = toMs(p.timestamp);
                let point = pointMap.get(ts);
                if (!point) {
                    point = { time: ts } as Record<string, number | null> & {
                        time: number;
                    };
                    pointMap.set(ts, point);
                }
                point[m.name] = p.value;
            }
        }

        const points = Array.from(pointMap.values()).sort(
            (a, b) => a.time - b.time
        );
        const start = points[0]?.time ?? 0;
        return points.map(p => ({ ...p, time: (p.time - start) / 1000 }));
    }, [metrics]);

    const minTime = dataset.length > 0 ? dataset[0].time : 0;
    const maxTime = dataset.length > 0 ? dataset.at(-1)!.time : 0;

    const allSameUnit = metrics.every(m => m.unit === metrics[0]?.unit);
    const singleAxisId = 'y';

    const yAxes = allSameUnit
        ? [
              {
                  id: singleAxisId,
                  scaleType: 'linear' as const,
                  min: 0,
                  label: metrics[0]?.unit ?? '',
                  valueFormatter: (value: number | null) =>
                      formatMetricsValue(metrics[0]?.name ?? '', {
                          number: value,
                          format: metrics[0]?.unit,
                      }),
                  position: 'left' as const,
              },
          ]
        : metrics.map((m, i) => {
              const name = m.name || m.id;
              return {
                  id: name,
                  scaleType: 'linear' as const,
                  label: name,
                  min: 0,
                  valueFormatter: (value: number | null) =>
                      formatMetricsValue(name, {
                          number: value,
                          format: m.unit,
                      }),
                  position: (i === 0 ? 'left' : 'right') as 'left' | 'right',
              };
          });

    console.log('MetricsSeriesChart', { metrics, dataset, minTime, maxTime });
    return (
        <>
            <Stack direction="row-reverse">
                <ChartDownloadButton
                    elementRef={chartRef}
                    width={1400}
                    height={400}
                />
            </Stack>
            <div ref={chartRef} style={{ width: '100%' }}>
                <LineChart
                    xAxis={[
                        {
                            dataKey: 'time',
                            scaleType: 'linear',
                            tickNumber: 6,
                            valueFormatter: (value: number) =>
                                formatTimeTick(value),
                            label: 'Time',
                            min: minTime,
                            max: maxTime,
                        },
                    ]}
                    yAxis={yAxes}
                    series={metrics.map(m => {
                        const name = m.name || m.id;
                        return {
                            dataKey: name,
                            label: name,
                            yAxisId: allSameUnit ? singleAxisId : name,
                            showMark: false,
                            connectNulls: true,
                            valueFormatter: value =>
                                formatMetricsValue(name, {
                                    number: value,
                                    format: m.unit,
                                }),
                        };
                    })}
                    margin={{ top: 50, right: 50, bottom: 50, left: 65 }}
                    sx={{
                        [`.${axisClasses.left} .${axisClasses.label}`]: {
                            transform: 'translateX(-15px)',
                        },
                    }}
                    dataset={dataset}
                    height={300}
                />
            </div>
        </>
    );
};
const EntryDetails = ({ entry }: { entry: any }) => (
    <RecordContextProvider value={entry}>
        <Stack direction={'column'} spacing={6} sx={{ mb: 2 }}>
            <Stack direction={'row'} spacing={3}>
                {entry.run && (
                    <Labeled>
                        <TextField source="run" label="run" />
                    </Labeled>
                )}
                <Labeled>
                    <IdField source="id" truncate={28} />
                </Labeled>
            </Stack>
            {entry.user && (
                <Labeled>
                    <TextField source="user" label="user" />
                </Labeled>
            )}
        </Stack>
    </RecordContextProvider>
);

const EntryMetadata = ({ entry }: { entry: any }) => (
    <RecordContextProvider value={entry}>
        <FunctionField
            source="metadata"
            render={record => (
                <Grid spacing={3} container>
                    {Object.entries(record.metadata).map(([key, value]) => (
                        <Grid key={key} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Labeled>
                                <TextField
                                    source={key}
                                    record={{ [key]: value }}
                                />
                            </Labeled>
                        </Grid>
                    ))}
                </Grid>
            )}
        />
    </RecordContextProvider>
);

type ChartViewProps = UseResourceMetricsProps & {
    showDetails?: boolean;
    showMetadata?: boolean;
    selectedId?: string;
    onSelected?: (id: string | null) => void;
};

export const MetricsChart = (props: ChartViewProps) => {
    const { showDetails = true, showMetadata = true, ...rest } = props;
    const getResourceLabel = useGetResourceLabel();
    const [selectedId, setSelectedId] = useState<string>(
        props.selectedId ?? ''
    );

    const { metrics: entriesList, refresh } = useListResourceMetrics(rest);
    const label = getResourceLabel('metrics', 1).toLowerCase();

    const onSelected = (e: any) => {
        setSelectedId(e.target?.value ?? '');
        props.onSelected?.(e.target?.value ?? '');
    };
    const currentEntry = useMemo(
        () => entriesList?.find((e: any) => e.id === selectedId),
        [entriesList, selectedId]
    );

    useEffect(() => {
        if (entriesList && entriesList.length > 0 && selectedId === '') {
            setSelectedId(entriesList[0].id);
        }
    }, [entriesList, selectedId]);

    if (entriesList == undefined || entriesList == null) {
        return <LoadingIndicator onClick={refresh} />;
    }

    return (
        <Stack>
            <Box>
                <FormControl fullWidth>
                    <InputLabel>{label}</InputLabel>
                    <Select
                        value={selectedId}
                        label={label}
                        onChange={onSelected}
                    >
                        {entriesList.map((e: any) => (
                            <MenuItem
                                key={'chart-metrics-select-' + e.id}
                                value={e.id}
                            >
                                {e.metadata?.name || e.id}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{ pt: 1 }}>
                {selectedId && currentEntry && (
                    <>
                        {showDetails && <EntryDetails entry={currentEntry} />}
                        {showMetadata && <EntryMetadata entry={currentEntry} />}

                        {currentEntry.metrics &&
                            currentEntry.metrics.length > 0 && (
                                <Box sx={{ pt: 1 }}>
                                    <MetricsSeriesChart
                                        metrics={currentEntry.metrics}
                                    />
                                </Box>
                            )}
                    </>
                )}
            </Box>
        </Stack>
    );
};

export default MetricsChart;

type ChartDownloadButtonProps = {
    elementRef: RefObject<HTMLElement>;
    fileName?: string;
    width?: number;
    height?: number;
    pixelRatio?: number;
};
const downloadImage = (dataUrl: string, name: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = name;
    a.click();
};
const ChartDownloadButton: FC<ChartDownloadButtonProps> = ({
    elementRef,
    fileName,
    width,
    height,
    pixelRatio,
}: ChartDownloadButtonProps) => {
    const translate = useTranslate();
    const theme = useTheme();
    const onClick = () => {
        const node = elementRef?.current;
        if (!node) return;
        const name =
            fileName ??
            `chart_${new Date().toLocaleString()}.png`
                .replace(/\s/g, '')
                .replace(/[,/:]/g, '_');
        const ratio = pixelRatio ?? 2;
        toPng(node, {
            backgroundColor: theme.palette.background.paper,
            width: width,
            height: height,
            pixelRatio: ratio,
            style: {
                width: '' + width,
                height: '' + height,
            },
        }).then(dataUrl => {
            downloadImage(dataUrl, name);
        });
    };
    return (
        <Stack direction="row">
            <IconButtonWithTooltip
                color="secondary"
                size="small"
                label={translate('actions.download_image')}
                onClick={onClick}
            >
                <DownloadIcon />
            </IconButtonWithTooltip>
        </Stack>
    );
};
