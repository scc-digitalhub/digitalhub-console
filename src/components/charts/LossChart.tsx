import { LineChart } from '@mui/x-charts';
import { Series } from '../MetricsTabComponent';

export const LossChart = (props: { series: Series[] }) => {
    const { series } = props;

    return (
        <LineChart
            series={series}
            slotProps={{ legend: { hidden: true } }}
            margin={{
                left: 24,
                right: 8,
                top: 8,
                bottom: 24,
            }}
        />
    );
};
