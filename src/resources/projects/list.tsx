import { RootSelectorButton, useRootSelector } from '@dslab/ra-root-selector';
import { DeleteWithDialogButton } from '@dslab/ra-delete-dialog-button';
import {
    List,
    Pagination,
    TopToolbar,
    useRecordContext,
    useTranslate,
    WithListContext,
    RecordContextProvider,
    useRedirect
} from 'react-admin';
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
    Container,
    Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FolderIcon from '@mui/icons-material/Folder';
import { grey } from '@mui/material/colors';

export const ProjectSelectorList = props => {
    const translate = useTranslate();
    const redirect = useRedirect();

    const perPage = [11,22,33];


    const cardStyle = {
        height: '100%',
        minWidth: '200px',
        maxWidth: '200px',
        display: 'flex',
        flexDirection: 'column',
    };

    const Toolbar = () => {
        return <TopToolbar> 
            </TopToolbar>;
    };

    return (
        <List
            {...props}
            actions={<Toolbar />}
            component={Box}
            perPage={perPage}
            pagination={<Pagination rowsPerPageOptions={[11,22]} />}
        >
            <Grid container spacing={2}>

            <WithListContext
                render={({ data }) => (
                    <>
                        <Grid item xs={6} md={3} lg={2} zeroMinWidth key="0">
                            <Card sx={cardStyle} >
                                <CardActionArea sx={{ height: '100%' }}>
                                <CardHeader
                        avatar={<FolderIcon />}
                        titleTypographyProps={{
                            variant: 'h6',
                            color: 'secondary.main',
                        }}/>
                                    <CardContent sx={{ height: '100%' }}>
                                        <Typography sx={{ mb: 2 }}>
                                            {translate('dashboard.create')}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions disableSpacing sx={{ mt: 'auto' }}>
                                    <Button fullWidth={true}
                                        startIcon={<AddIcon />}
                                        style={{ marginLeft: 'auto' }}
                                        variant="contained"
                                        onClick={() => redirect('/projects/create')}
                                    >{translate('buttons.create')}</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                        {data?.map(project => (
                            <RecordContextProvider value={project}>
                            <ProjectsGrid key={project.id}/>
                            </RecordContextProvider>
                        ))}
                    </>
                )}
            />
            </Grid>
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
        minWidth: '200px',
        maxWidth: '200px',
        display: 'flex',
        flexDirection: 'column',
    };

    return (
        <Grid item xs={6} md={3} lg={2} zeroMinWidth spacing={2}>
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
