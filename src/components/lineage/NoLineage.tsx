import { Typography } from '@mui/material';
import { useTranslate } from 'react-admin';
import '@xyflow/react/dist/style.css';

export const NoLineage = () => {
    const translate = useTranslate();

    return (
        <Typography
            variant="body1"
            color={'gray'}
            sx={{ textAlign: 'center', pt: 5 }}
        >
            {translate('messages.lineage.noLineage')}
        </Typography>
    );
};
