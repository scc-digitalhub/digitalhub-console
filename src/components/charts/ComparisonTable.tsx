import { LineChart } from '@mui/x-charts';
import { Series } from '../MetricsTabComponent';
import { Box, alpha, useTheme } from '@mui/material';
import { CounterBadge } from '../CounterBadge';

export const ComparisonTable = (props: { values: Series[] }) => {
    const { values } = props;
    const theme = useTheme();
    const bgColor = alpha(theme.palette?.primary?.main, 0.08);

    return (
        <>
            {values && values.map((item, index) => (
                <>
                <div>
                    {`${item.label}: ${item.data}`}
                </div>
                </>
            ))}
        </>
    );
};
