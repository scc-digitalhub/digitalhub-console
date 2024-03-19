import {
    Box,
    ListItem,
    ListItemButton,
    ListItemText,
    List as MuiList,
    Typography,
    useTheme,
} from '@mui/material';
import { useCreatePath } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import { convertToDate } from './helper';

export const RecentList = (props: { resource: string; elements: any[] }) => {
    const { resource, elements } = props;
    const createPath = useCreatePath();
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <MuiList sx={{ pt: 0, mt: 2 }}>
            {elements.slice(0, 3).map(el => (
                <ListItem disablePadding key={el.id}>
                    <ListItemButton
                        onClick={() =>
                            navigate(
                                createPath({
                                    type: 'show',
                                    resource: resource,
                                    id: el.id,
                                })
                            )
                        }
                        sx={{
                            '&:hover': {
                                backgroundColor:
                                    theme.palette.background.default,
                            },
                            paddingY: 1.5,
                        }}
                        disableGutters
                    >
                        <ListItemText
                            disableTypography
                            primary={
                                <Typography variant="body1" color={'primary'}>
                                    {el.metadata.name || el.name}
                                </Typography>
                            }
                            secondary={
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                >
                                    <Typography variant="body2" color={'gray'}>
                                        {el.metadata?.updated
                                            ? convertToDate(
                                                  el.metadata.updated
                                              ).toLocaleString()
                                            : ''}
                                    </Typography>

                                    <Typography variant="body2" color={'gray'}>
                                        {el.kind}
                                    </Typography>
                                </Box>
                            }
                            sx={{ my: 0 }}
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </MuiList>
    );
};
