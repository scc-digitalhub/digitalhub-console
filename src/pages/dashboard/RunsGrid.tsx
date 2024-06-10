import { Grid, Paper, Typography } from '@mui/material';
import { useTranslate } from 'react-admin';
import { StateColors } from '../../components/StateChips';
import { CounterBadge } from '../../components/CounterBadge';

export const RunsGrid = (props: {
    runs: {
        completed: number | undefined;
        running: number | undefined;
        error: number | undefined;
    };
}) => {
    const { runs } = props;
    const entries = Object.entries(runs);
    const translate = useTranslate();

    return (
        <Grid container justifyContent="center" height="5em">
            {entries.map(([k, v]) => (
                <Grid
                    item
                    xs={true}
                    key={k}
                    textAlign={'center'}
                    minWidth={'5em'}
                >
                    <CounterBadge
                        value={v}
                        color={`${StateColors[k.toUpperCase()]}.contrastText`}
                        backgroundColor={`${StateColors[k.toUpperCase()]}.main`}
                    />
                    <Typography
                        variant="body2"
                        sx={{ textAlign: 'center' }}
                        pt={0.5}
                    >
                        {translate(`pages.dashboard.states.${k}`)}
                    </Typography>
                </Grid>
            ))}
        </Grid>
    );
};
