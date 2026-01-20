// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useState, useRef, React } from 'react';
import {
    LoadingIndicator,
    RecordContextProvider,
    useGetResourceLabel,
    useListController,
    useRecordContext,
    Labeled,
    TextField,
    Identifier,
    IconButtonWithTooltip,
    useTranslate,
} from 'react-admin';
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    useTheme,
} from '@mui/material';
import { ByteConverter, B as Byte } from '@wtfcode/byte-converter';
import Parser from 'k8s-resource-parser';
import { axisClasses, LineChart } from '@mui/x-charts';
import { formatTimeTick } from '../../../common/utils/helper';
import DownloadIcon from '@mui/icons-material/FileDownload';
import { toPng } from 'html-to-image';

type ChartViewProps = {
    id?: Identifier;
    resource?: string;
    onContainerSelect?: (containerName: string) => void;
};

export const ChartView = (props: ChartViewProps) => {
    const { id, resource, onContainerSelect } = props;
    const getResourceLabel = useGetResourceLabel();
    const [selectedId, setSelectedId] = useState<string>('');
    const [currentLog, setCurrentLog] = useState<any>(undefined);

    const label = getResourceLabel('container', 1).toLowerCase();

    const filter = useMemo(() => {
        const f: any = {};
        if ('runs' === resource && id) {
            f['run'] = id;
        }
        return f;
    }, [resource, id]);

    const { data } = useListController({
        resource: 'logs',
        sort: { field: 'created', order: 'DESC' },
        filter,
        perPage: 100,
        disableSyncWithLocation: true,
    });

    const recordContext = useRecordContext();
    const podName =
        recordContext?.status?.pod ||
        recordContext?.metadata?.name ||
        recordContext?.name ||
        '';
    const startTime = recordContext?.startTime;

    const filteredData = useMemo(() => {
        if (!data) return [];
        if (!podName) return data;
        return data.filter((r: any) => {
            const podField = r?.status?.pod || r?.metadata?.pod || r?.spec?.pod;
            return !!podField && podField === podName;
        });
    }, [data, podName]);

    useEffect(() => {
        if (filteredData.length > 0 && selectedId === '') {
            const firstItemId = filteredData[0].id;
            setSelectedId(firstItemId);
        }
    }, [filteredData, selectedId]);

    useEffect(() => {
        if (data && selectedId !== '') {
            const r = data.find((r: any) => r.id === selectedId);
            setCurrentLog(r);
        } else {
            setCurrentLog(undefined);
        }
    }, [data, selectedId]);

    useEffect(() => {
        const containerName = currentLog?.status?.container || '';
        if (typeof onContainerSelect === 'function') {
            onContainerSelect(containerName);
        }
    }, [currentLog, onContainerSelect]);

    if (!data) {
        return <LoadingIndicator />;
    }

    const onSelected = (e: any) => {
        if (e.target?.value) {
            setSelectedId(e.target.value);
        } else {
            setSelectedId('');
        }
    };

    const LogMetrics = (props: { metrics: any[] }) => {
        const { metrics } = props;
        const chartRef = useRef<HTMLDivElement>(null);
        const keyToLabel: { [key: string]: string } = {
            cpu: 'Cpu (n)',
            memory: 'Memory (MB)',
        };

        const data = useMemo(() => {
            if (!metrics || metrics.length === 0) return [];

            const sortedMetrics = [...metrics].sort(
                (a, b) =>
                    new Date(a.timestamp).getTime() -
                    new Date(b.timestamp).getTime()
            );
            const start = new Date(startTime).getTime();

            return sortedMetrics.map(
                (m: { timestamp: any; usage: any }, index: number) => {
                    const currentTime = new Date(m.timestamp).getTime();
                    const relativeTime = (currentTime - start) / 1000;

                    let val = {
                        time: relativeTime,
                        index: index,
                    };

                    if (m.usage.memory) {
                        const bytes = Parser.memoryParser(m.usage.memory);
                        val['memory'] = ByteConverter.convert(
                            Byte.value(bytes),
                            'MB'
                        ).value;
                    }
                    if (m.usage.cpu) {
                        const cpu = m.usage.cpu.endsWith('n')
                            ? parseInt(m.usage.cpu.slice(0, -1)) / 1000000
                            : parseInt(m.usage.cpu);
                        val['cpu'] = cpu;
                    }
                    return val;
                }
            );
        }, [metrics]);
        const minTime = data.length > 0 ? data[0].time : 0;
        const maxTime = data.length > 0 ? data[data.length - 1].time : 0;

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
                        yAxis={Object.keys(keyToLabel).map(key => ({
                            id: key,
                            scaleType: 'linear',
                            label: keyToLabel[key],
                            min: 0,
                            position: key == 'cpu' ? 'left' : 'right',
                        }))}
                        series={Object.keys(keyToLabel).map(key => ({
                            dataKey: key,
                            label: keyToLabel[key],
                            yAxisId: key,
                            showMark: false,
                        }))}
                        margin={{ top: 50, right: 50, bottom: 50, left: 65 }}
                        sx={{
                            [`.${axisClasses.left} .${axisClasses.label}`]: {
                                transform: 'translateX(-15px)',
                            },
                        }}
                        dataset={data}
                        height={300}
                    />
                </div>
            </>
        );
    };

    const LogsPreview = () => {
        const record = useRecordContext();
        if (!record) return <></>;

        return (
            <Stack direction={'row'} spacing={6} sx={{ mb: 2 }}>
                {record.status?.container && (
                    <Labeled>
                        <TextField source="status.container" />
                    </Labeled>
                )}
                {record.status?.pod && (
                    <Labeled>
                        <TextField source="status.pod" />
                    </Labeled>
                )}
            </Stack>
        );
    };

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
                        {filteredData.map((r: any) => (
                            <MenuItem
                                key={'chart-logs-select-' + r.id}
                                value={r.id}
                            >
                                {r.status?.container ||
                                    r.metadata?.updated ||
                                    r.id}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{ pt: 1 }}>
                <RecordContextProvider value={currentLog ?? {}}>
                    {selectedId && currentLog ? (
                        <>
                            <LogsPreview />
                            {currentLog?.status?.metrics && (
                                <Box sx={{ pt: 1 }}>
                                    <LogMetrics
                                        metrics={currentLog.status.metrics}
                                    />
                                </Box>
                            )}
                        </>
                    ) : null}
                </RecordContextProvider>
            </Box>
        </Stack>
    );
};

type ChartDownloadButtonProps = {
    elementRef: React.RefObject<HTMLElement>;
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
const ChartDownloadButton: React.FC<ChartDownloadButtonProps> = ({
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
