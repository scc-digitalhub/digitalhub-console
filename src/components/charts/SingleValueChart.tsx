import { LineChart } from '@mui/x-charts';
import { Series } from '../MetricsTabComponent';
import { Box, alpha, useTheme } from '@mui/material';
import { CounterBadge } from '../CounterBadge';

export const SingleValueChart = (props: { values: Series[] }) => {
    const { values } = props;
    const theme = useTheme();
    const bgColor = alpha(theme.palette?.primary?.main, 0.08);

    return (
        <>
            {values && values.length == 1 ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                    }}
                >
                    <CounterBadge
                        value={values[0].data}
                        color="secondary.main"
                        backgroundColor={bgColor}
                        size="large"
                    />
                </Box>
            ) : (
                <div>ciao</div>
            )}
        </>
    );
};
