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
    useRedirect,
    useTheme,
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
    const theme = useTheme();
    const perPage = [7, 15, 23];

    const cardStyle = {
        height: '250px',
        width: '250px',
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        background:'#E0701B',
        color:'white'
    };

    const Toolbar = () => {
        return <TopToolbar></TopToolbar>;
    };

    return (
        <List
            {...props}
            actions={<Toolbar />}
            component={Box}
            perPage={perPage}
            pagination={<Pagination rowsPerPageOptions={perPage} />}
        >
            <Grid
                container
                spacing={2}
            >
                <WithListContext
                    render={({ data }) => (
                        <>
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                zeroMinWidth
                                rowSpacing={1}
                                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                            >
                                <Card sx={cardStyle} color="secondary">
                                    <CardActionArea sx={{ height: '100%' }} color="secondary">
                                        <CardHeader
                                            avatar={<FolderIcon />}
                                            titleTypographyProps={{
                                                variant: 'h6',
                                                color: 'secondary.main',
                                            }}
                                        />
                                        <CardContent sx={{ height: '100%' }}>
                                            <Typography sx={{ mb: 2 }}>
                                                {translate('dashboard.create')}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                    <CardActions
                                        disableSpacing
                                        sx={{ mt: 'auto' }}
                                    >
                                        <Button
                                            fullWidth={true}
                                            startIcon={<AddIcon />}
                                            style={{ marginLeft: 'auto' }}
                                            variant="contained"
                                            disableElevation
                                            onClick={() =>
                                                redirect('/projects/create')
                                            }
                                        >
                                            {translate('buttons.create')}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                            {data?.map(project => (
                                <RecordContextProvider value={project}>
                                    <ProjectsGrid key={project.id} />
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
        height: '250px',
        width: '250px',
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
    };

    return (
        <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            zeroMinWidth
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
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
