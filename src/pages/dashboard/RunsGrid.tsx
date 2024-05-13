import { Grid, Paper, Typography } from '@mui/material';
import { useTranslate } from 'react-admin';
import { StateColors } from '../../components/StateChips';

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
                    <Paper
                        variant="outlined"
                        sx={{
                            backgroundColor: `${
                                StateColors[k.toUpperCase()]
                            }.main`,
                            color: `${
                                StateColors[k.toUpperCase()]
                            }.contrastText`,
                            lineHeight: '100%',
                            aspectRatio: 1,
                            display: 'inline-grid',
                            placeItems: 'center',
                            minWidth: '3.2em',
                            minHeight: '3.2em',
                            padding: '.5em',
                            borderRadius: '50%',
                            boxSizing: 'border-box',
                        }}
                    >
                        {v}
                    </Paper>
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
