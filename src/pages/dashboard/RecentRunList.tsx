import {
    Box,
    ListItem,
    List as MuiList,
    Typography,
    useTheme
} from '@mui/material';
import { StateChips } from '../../components/StateChips';
import { convertToDate } from './helper';

export const RecentRunsList = (props: { elements: any[] }) => {
    const { elements } = props;
    const theme = useTheme();

    console.error(elements);

    return (
        <MuiList sx={{ pt: 0 }}>
            {elements.slice(0, 3).map(el => (
                <ListItem
                    key={el.id}
                    sx={{
                        justifyContent: 'space-between',
                        '&:hover': {
                            backgroundColor: theme.palette.background.default,
                        },
                        paddingY: 1.3,
                    }}
                >
                    <Box display="flex" flexDirection="column">
                        <Typography variant="body1" color={'primary'}>
                            f1 transform
                        </Typography>
                        <Typography variant="body2" color={'secondary.light'}>
                            {el.metadata?.updated
                                ? convertToDate(
                                      el.metadata.updated
                                  ).toLocaleString()
                                : ''}
                        </Typography>
                    </Box>

                    <StateChips
                        record={el}
                        source="status.state"
                        resource="artifact"
                    />
                </ListItem>
            ))}
        </MuiList>
    );
};