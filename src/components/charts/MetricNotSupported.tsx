import { LineChart } from '@mui/x-charts';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { Stack, fontWeight } from '@mui/system';
import { Typography } from '@mui/material';
export const MetricNotSupported = () => {
    return (
        <Stack
            direction="column"
            spacing={0.5}
            sx={{
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Metric not supported
            </Typography>
            <SentimentVeryDissatisfiedIcon />
        </Stack>
    );
};
