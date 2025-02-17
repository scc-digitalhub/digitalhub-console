import { Box, alpha, useTheme } from '@mui/material';
import { CounterBadge } from '../CounterBadge';
import { Series } from './utils';

export const SingleValue = (props: { values: Series }) => {
    const { values } = props;
    const theme = useTheme();
    const bgColor = alpha(theme.palette?.primary?.main, 0.08);

    return (
        <>
            {values && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                    }}
                >
                    <CounterBadge
                        value={values.data}
                        color="secondary.main"
                        backgroundColor={bgColor}
                        size="large"
                    />
                </Box>
            )}
        </>
    );
};
