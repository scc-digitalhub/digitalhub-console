import {
    Grid,
    ListItem,
    ListItemButton,
    ListItemText,
    List as MuiList,
    Typography,
    useTheme
} from '@mui/material';
import {
    useCreatePath
} from 'react-admin';
import { useNavigate } from 'react-router-dom';
import { convertToDate } from './helper';

export const RecentList = (props: { resource: string; elements: any[] }) => {
    const { resource, elements } = props;
    const createPath = useCreatePath();
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <MuiList sx={{ pt: 0 }}>
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
                            paddingY: 1.3,
                        }}
                        //disableGutters
                    >
                        <ListItemText
                            disableTypography
                            primary={
                                <Grid container spacing={0}>
                                    <Grid item xs={6}>
                                        <Typography
                                            variant="body1"
                                            color={'primary'}
                                        >
                                            {el.metadata.name || el.name}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={6}
                                        sx={{ textAlign: 'right' }}
                                    >
                                        <Typography
                                            variant="body1"
                                            color={'secondary.light'}
                                        >
                                            {el.kind}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            }
                            secondary={
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
                            }
                            sx={{ my: 0 }}
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </MuiList>
    );
};
