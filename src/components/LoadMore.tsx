import { Box } from '@mui/material';
import {
    useInfinitePaginationContext,
    Button,
    useTranslate,
} from 'react-admin';

export const LoadMore = () => {
    const translate = useTranslate();
    const { hasNextPage, fetchNextPage, isFetchingNextPage } =
        useInfinitePaginationContext();
    return hasNextPage ? (
        <Box mt={1} textAlign="center">
            <Button
                color="info"
                size="small"
                disabled={isFetchingNextPage}
                onClick={() => fetchNextPage()}
            >
                {translate('actions.load_more')}
            </Button>
        </Box>
    ) : null;
};
