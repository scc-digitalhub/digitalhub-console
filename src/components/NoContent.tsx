import Typography from '@mui/material/Typography';
import { useTranslate } from 'react-admin';

export const NoContent = (props: { message: string }) => {
    const { message } = props;
    const translate = useTranslate();

    return (
        <Typography
            variant="body1"
            color={'gray'}
            sx={{ textAlign: 'center', paddingY: 4 }}
        >
            {translate(message)}
        </Typography>
    );
};
