import {
    Box,
    Typography
} from '@mui/material';
import {
    useTranslate
} from 'react-admin';
import { RecentList } from './RecentList';
import { RecentRunsList } from './RecentRunList';

export const Recent = (props: { resource: string; elements: any[] }) => {
    const { resource, ...rest } = props;
    const translate = useTranslate();

    return (
        <Box sx={{ mt: 2 }}>
            <Typography
                variant="h6"
                color={'secondary.light'}
                fontWeight="bold"
            >
                {translate('pages.dashboard.recent') + ': '}
            </Typography>
            {resource === 'runs' ? (
                <RecentRunsList {...rest} />
            ) : (
                <RecentList resource={resource} {...rest} />
            )}
        </Box>
    );
};