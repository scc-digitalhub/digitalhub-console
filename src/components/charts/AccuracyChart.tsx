import { LineChart, LineChartProps } from '@mui/x-charts';
import { chartPalette, Series, valueFormatter } from './utils';

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

    const arraySeries = series.map(s =>
        !Array.isArray(s.data)
            ? { ...s, data: [s.data], valueFormatter }
            : { ...s, valueFormatter }
    );

    return (
        <LineChart
            series={arraySeries}
            slotProps={slotProps}
            margin={margin}
            colors={chartPalette}
            {...rest}
        />
    );
};

export type AccuracyChartProps = Omit<LineChartProps, 'series'> & {
    series: Series[];
};
