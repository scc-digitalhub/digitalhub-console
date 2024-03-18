import {
    Box,
    ListItem,
    List as MuiList,
    Typography,
    useTheme,
    ListItemButton,
} from '@mui/material';
import { StateChips } from '../../components/StateChips';
import { convertToDate } from './helper';
import { useCreatePath } from 'react-admin';
import { useNavigate } from 'react-router-dom';

export const RecentRunsList = (props: { elements: any[] }) => {
    const { elements } = props;
    const createPath = useCreatePath();
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <MuiList sx={{ pt: 0 }}>
            {elements.slice(0, 3).map(el => {
                const task = el?.spec?.task || '';
                const url = new URL(task);

                const taskKind = url.protocol
                    ? url.protocol.substring(0, url.protocol.length - 1)
                    : '';

                const functionData = url.pathname.split('/')[3];
                const functionName = functionData.split(':')[0];
                const functionId = functionData.split(':')[1];

                return (
                    <ListItem disablePadding key={el.id}>
                        <ListItemButton
                            onClick={() =>
                                navigate(
                                    createPath({
                                        type: 'show',
                                        resource: 'functions',
                                        id: functionId,
                                    })
                                )
                            }
                            sx={{
                                '&:hover': {
                                    backgroundColor:
                                        theme.palette.background.default,
                                },
                                paddingY: 1.5,
                                justifyContent: 'space-between',
                            }}
                            disableGutters
                        >
                            <Box display="flex" flexDirection="column">
                                <Typography variant="body1" color={'primary'}>
                                    {`${functionName} ${taskKind}`}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color={'secondary.light'}
                                >
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
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </MuiList>
    );
};
