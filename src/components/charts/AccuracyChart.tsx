import { LineChart, LineChartProps } from '@mui/x-charts';
import { Series } from '../MetricCard';

export const AccuracyChart = (props: AccuracyChartProps) => {
    const {
        series,
        slotProps = { legend: { hidden: true } },
        margin = {
            left: 24,
            right: 8,
            top: 8,
            bottom: 24,
        },
        ...rest
    } = props;

    return (
        <LineChart
            series={series}
            slotProps={slotProps}
            margin={margin}
            {...rest}
        />
    );
};

export type AccuracyChartProps = Omit<LineChartProps, 'series'> & {
    series: Series[];
};
