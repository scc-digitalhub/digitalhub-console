import { BarChart, BarChartProps } from '@mui/x-charts';
import { Series } from '../MetricsTabComponent';

export const LossChart = (props: LossChartProps) => {
    const {
        series,
        slotProps = { legend: { hidden: true } },
        margin = {
            left: 56,
            right: 8,
            top: 8,
            bottom: 24,
        },
        ...rest
    } = props;

    return (
        <BarChart
            series={series}
            slotProps={slotProps}
            margin={margin}
            {...rest}
        />
    );
};

export type LossChartProps = Omit<BarChartProps, 'series'> & {
    series: Series[];
};
