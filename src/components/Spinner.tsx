import { Box, CircularProgress, useTheme } from '@mui/material';

export const Spinner = () => {
    const theme = useTheme();

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress
                color="inherit"
                size={theme.spacing(6)}
                thickness={3}
            />
        </Box>
    );
};
