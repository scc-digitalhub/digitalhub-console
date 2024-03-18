import { Grid, Paper, Typography, useTheme } from '@mui/material';

export const Counter = (props: { value: number | undefined }) => {
    const { value } = props;
    const theme = useTheme();

    return (
        <Grid container justifyContent="center">
            <Grid item md={4} zeroMinWidth key={1} textAlign={'center'}>
                <Paper
                    elevation={0}
                    sx={{
                        backgroundColor: theme.palette.background.default,
                        lineHeight: '100%',
                        aspectRatio: 1,
                        display: 'inline-grid',
                        placeItems: 'center',
                        minWidth: '5em',
                        minHeight: '5em',
                        padding: '.5em',
                        borderRadius: '50%',
                        boxSizing: 'border-box',
                    }}
                >
                    <Typography variant="h4" sx={{ textAlign: 'center' }}>
                        {value}
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
};
