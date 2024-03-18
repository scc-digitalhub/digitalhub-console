import { RootSelectorButton, useRootSelector } from '@dslab/ra-root-selector';
import { DeleteWithDialogButton } from '@dslab/ra-delete-dialog-button';
import {
    List,
    Pagination,
    TopToolbar,
    useRecordContext,
    useTranslate,
    WithListContext,
    Button,
    RecordContextProvider,
    CreateButton
} from 'react-admin';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Grid,
    List as MuiList,
    ListItem,
    Typography,
    Chip,
    Stack,
    CardActionArea,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import { grey } from '@mui/material/colors';

export const ProjectSelectorList = props => {
    const translate = useTranslate();
    const navigate = useNavigate();

    const perPage = 8;


    const cardStyle = {
        height: '100%',
        minWidth: '200px',
        maxWidth: '200px',
        display: 'flex',
        flexDirection: 'column',
    };

    const Toolbar = () => {
        return <TopToolbar> 
            {/* <CreateButton />  */}
            </TopToolbar>;
    };

    return (
        <List
            {...props}
            actions={<Toolbar />}
            component={Box}
            perPage={perPage}
            pagination={<Pagination rowsPerPageOptions={[perPage]} />}
        >
            <WithListContext
                render={({ data }) => (
                    <Stack spacing={2} sx={{ padding: 2 }} direction={'row'}>
                        <Grid item xs={12} md={3} zeroMinWidth key="0">
                            <Card sx={cardStyle}>
                                <CardActionArea sx={{ height: '100%' }}>
                                    <CardContent sx={{ height: '100%' }}>
                                        <Typography sx={{ mb: 2 }}>
                                            {translate('dashboard.create')}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions disableSpacing sx={{ mt: 'auto' }}>
                                    <Button fullWidth={true}
                                        style={{ marginLeft: 'auto' }}
                                        variant="contained"
                                        label={translate('buttons.create')}
                                        onClick={() => navigate('projects/create')}
                                    />
                                </CardActions>
                            </Card>
                        </Grid>
                        {data?.map(project => (
                            <RecordContextProvider value={project}>
                            <ProjectsGrid key={project.id}/>
                            </RecordContextProvider>
                        ))}
                    </Stack>
                )}
            />
        </List>
    );
};

const MyGrid = (props: any) => {
    return <Grid container {...props} spacing={2} />;
};

const convertToDate = value => {
    if (typeof value === 'string' || typeof value === 'number') {
        return new Date(value);
    }
    return value;
};

const ProjectsGrid = () => {
    const translate = useTranslate();
    const project = useRecordContext();
    const { selectRoot } = useRootSelector();

    const handleClick = e => {
        if (project) {
            selectRoot(project);
        }
        e.stopPropagation();
    };

    const cardStyle = {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    };

    return (
        <Grid item xs={12} md={3} zeroMinWidth>
            <Card sx={cardStyle}>
                <CardActionArea sx={{ height: '100%' }} onClick={handleClick}>
                    <CardHeader
                        title={
                            project.metadata
                                ? project.metadata.name
                                : project.id
                        }
                        avatar={<FolderIcon />}
                        titleTypographyProps={{
                            variant: 'h6',
                            color: 'secondary.main',
                        }}
                    />
                    <CardContent sx={{ height: '100%' }}>
                        <Typography sx={{ mb: 2 }}>
                            {project.description}
                        </Typography>
                        <Box color={grey[500]} sx={{ mb: 2 }}>
                            {project.metadata && (
                                <MuiList sx={{ pb: 0 }}>
                                    <ListItem disableGutters sx={{ p: 0 }}>
                                        {translate('pages.dashboard.created')}
                                        {': '}
                                        {convertToDate(
                                            project.metadata.created
                                        ).toLocaleString()}
                                    </ListItem>
                                    <ListItem disableGutters sx={{ p: 0 }}>
                                        {translate('pages.dashboard.updated')}
                                        {': '}
                                        {convertToDate(
                                            project.metadata.updated
                                        ).toLocaleString()}
                                    </ListItem>
                                </MuiList>
                            )}
                        </Box>
                        <Stack direction="row" spacing={1}>
                            {project.metadata?.labels?.map((label: string) => (
                                <Chip key={label} label={label} />
                            ))}
                        </Stack>
                    </CardContent>
                </CardActionArea>
                <CardActions disableSpacing sx={{ mt: 'auto' }}>
                    <RootSelectorButton label="ra.action.open" />
                    <DeleteWithDialogButton confirmTitle="Resource Deletion" />
                </CardActions>
            </Card>
        </Grid>
    );
};
