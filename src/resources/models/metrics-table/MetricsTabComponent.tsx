import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Grid,
    Typography,
    alpha,
    useTheme,
} from '@mui/material';
import { enUS, itIT } from '@mui/x-data-grid';
import { useLocaleState, useTranslate } from 'react-admin';
import { LineChart } from '@mui/x-charts/LineChart';
import { CounterBadge } from '../../../components/CounterBadge';

export type Metric = {
    name: string;
    values: any;
};
export const MetricsTabComponent = (props: { record: any }) => {
    const { record } = props;
    const translate = useTranslate();
    const [locale] = useLocaleState();
    const localeText =
        locale && locale === 'it'
            ? itIT.components.MuiDataGrid.defaultProps.localeText
            : enUS.components.MuiDataGrid.defaultProps.localeText;
    const tmpMetrics = {
        Loss: 45,
        Accuracy: Array.from({ length: 10 }, () => Math.random()),
        Precision: Array.from({ length: 10 }, () => Math.random()),
        Recall: Array.from({ length: 10 }, () => Math.random()),
        CPU: 0.32,
        RAM: 200,
    };
    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            <Typography variant="h6" gutterBottom>
                {translate('resources.models.metrics.title')}
            </Typography>

            {tmpMetrics && (
                <Grid container spacing={2} sx={{ paddingY: '16px' }}>
                    {Object.entries(tmpMetrics).map(([key, value], index) => (
                        <Grid item xs={12} md={4} key={'metric_' + index}>
                            <MetricCard metric={{ name: key, values: value }} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};
const MetricCard = (props: { metric: Metric }) => {
    const { metric } = props;
    const theme = useTheme();
    const bgColor = alpha(theme.palette?.primary?.main, 0.08);

    return (
        <Card>
            <CardHeader title={metric.name} />

            <CardContent sx={{ paddingTop: 0 }}>
                <Typography
                    variant="body2"
                    sx={{ height: '120px', overflowY: 'auto' }}
                >
                    {typeof metric.values === 'number' ? (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%',
                            }}
                        >
                            <CounterBadge
                                value={metric.values}
                                color="secondary.main"
                                backgroundColor={bgColor}
                                size="large"
                            />
                        </Box>
                    ) : (
                        <LineChart
                            xAxis={[
                                { data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
                            ]}
                            series={[
                                {
                                    data: metric.values,
                                    label: metric.name,
                                    showMark: false,
                                },
                            ]}
                            slotProps={{ legend: { hidden: true } }}
                            margin={{
                                left: 24,
                                right: 8,
                                top: 8,
                                bottom: 24,
                            }}
                        />
                    )}
                </Typography>
            </CardContent>
        </Card>
    );
};
