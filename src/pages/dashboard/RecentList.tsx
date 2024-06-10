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

export const RecentList = (props: {
    resource: string;
    records: any[];
    num?: number;
}) => {
    const { resource, records, num = 3 } = props;
    const createPath = useCreatePath();
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <MuiList sx={{ pt: 0, mt: 2 }}>
            {records?.slice(0, num).map(record => (
                <ListItem disablePadding key={record.id}>
                    <ListItemButton
                        onClick={() =>
                            navigate(
                                createPath({
                                    type: 'show',
                                    resource: resource,
                                    id: record.id,
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
                                    {record.metadata.name || record.name}
                                </Typography>
                            }
                            secondary={
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                >
                                    <Typography variant="body2" color={'gray'}>
                                        {record.metadata?.updated
                                            ? convertToDate(
                                                  record.metadata.updated
                                              ).toLocaleString()
                                            : ''}
                                    </Typography>

                                    <Typography variant="body2" color={'gray'}>
                                        {record.kind}
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
