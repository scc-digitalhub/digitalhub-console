import { useEffect, useState } from 'react';
import {
    CreateButton,
    ListButton,
    LoadingIndicator,
    SortPayload,
    useCreatePath,
    useDataProvider,
    useTranslate,
} from 'react-admin';
import {
    Card,
    CardContent,
    CardActions,
    CardHeader,
    Container,
    Grid,
    Box,
    Typography,
    List as MuiList,
    ListItem,
    Paper,
    useTheme,
    ListItemText,
    Stack,
    Chip,
    ListItemButton,
} from '@mui/material';

import { PageTitle } from '../components/PageTitle';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import TableChartIcon from '@mui/icons-material/TableChart';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { grey } from '@mui/material/colors';

import { useRootSelector } from '@dslab/ra-root-selector';
import { useNavigate } from 'react-router-dom';

const convertToDate = value => {
    if (typeof value === 'string' || typeof value === 'number') {
        return new Date(value);
    }
    return value;
};

export const Dashboard = () => {
    const dataProvider = useDataProvider();
    const { root: projectId } = useRootSelector();
    const translate = useTranslate();

    const [project, setProject] = useState<any>();

    const [functions, setFunctions] = useState<any[]>();
    const [artifacts, setArtifacts] = useState<any[]>();
    const [dataItems, setDataItems] = useState<any[]>();

    const [totalFunctions, setTotalFunctions] = useState<number>();
    const [totalDataItems, setTotalDataItems] = useState<number>();
    const [totalArtifacts, setTotalArtifacts] = useState<number>();

    const [completed, setCompleted] = useState<number>();
    const [running, setRunning] = useState<number>();
    const [error, setError] = useState<number>();

    useEffect(() => {
        if (dataProvider && projectId) {
            dataProvider.getOne('projects', { id: projectId }).then(res => {
                if (res.data) {
                    setProject(res.data);
                }
            });
            const params = {
                pagination: { page: 1, perPage: 5 },
                sort: { field: 'updated', order: 'DESC' } as SortPayload,
                filter: {},
            };
            dataProvider.getList('functions', params).then(res => {
                if (res.data) {
                    setFunctions(res.data);
                    setTotalFunctions(res.total);
                }
            });
            dataProvider.getList('artifacts', params).then(res => {
                if (res.data) {
                    setTotalArtifacts(res.total);
                    setArtifacts(res.data);
                }
            });
            dataProvider.getList('dataitems', params).then(res => {
                if (res.data) {
                    setTotalDataItems(res.total);
                    setDataItems(res.data);
                }
            });
            dataProvider
                .getList('runs', { ...params, filter: { state: 'COMPLETED' } })
                .then(res => {
                    if (res.data) {
                        setCompleted(res.total);
                    }
                });
            dataProvider
                .getList('runs', { ...params, filter: { state: 'RUNNING' } })
                .then(res => {
                    if (res.data) {
                        setRunning(res.total);
                    }
                });
            dataProvider
                .getList('runs', { ...params, filter: { state: 'ERROR' } })
                .then(res => {
                    if (res.data) {
                        setError(res.total);
                    }
                });
        }
    }, [dataProvider, projectId]);

    if (!project) {
        return <LoadingIndicator />;
    }

    const cardStyle = {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    };

    return (
        <Container maxWidth={false}>
            <div>
                <PageTitle
                    text={project.metadata ? project.metadata.name : project.id}
                    secondaryText={project.metadata?.description}
                    icon={<DashboardIcon fontSize={'large'} />}
                    sx={{ pl: 0, pr: 0 }}
                />
                <Box color={grey[500]} sx={{ pt: 0, textAlign: 'left' }}>
                    {project.metadata && (
                        <MuiList sx={{ pt: 0 }}>
                            <ListItem disableGutters sx={{ pt: 0 }}>
                                {translate('pages.dashboard.created')}{' '}
                                {convertToDate(
                                    project.metadata.created
                                ).toLocaleString()}
                            </ListItem>
                            <ListItem disableGutters sx={{ pt: 0 }}>
                                {translate('pages.dashboard.updated')}{' '}
                                {convertToDate(
                                    project.metadata.updated
                                ).toLocaleString()}
                            </ListItem>
                        </MuiList>
                    )}
                </Box>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    {project.metadata?.labels?.map((label: string) => (
                        <Chip key={label} label={label} />
                    ))}
                </Stack>
            </div>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} xl={3} zeroMinWidth>
                    <Card sx={cardStyle}>
                        <CardHeader
                            title={translate('pages.dashboard.artifacts.title')}
                            avatar={<InsertDriveFileIcon />}
                            titleTypographyProps={{
                                variant: 'h6',
                                color: 'secondary.main',
                            }}
                        />
                        <CardContent>
                            <Counter value={totalArtifacts} />
                            {!!artifacts && artifacts.length > 0 ? (
                                <Recent
                                    resource="artifacts"
                                    elements={artifacts}
                                />
                            ) : (
                                <Typography
                                    sx={{ textAlign: 'center', p: '70px 0' }}
                                >
                                    <CreateButton
                                        resource="artifacts"
                                        variant="contained"
                                    />
                                </Typography>
                            )}
                        </CardContent>
                        <CardActions disableSpacing sx={{ mt: 'auto' }}>
                            {!!artifacts && artifacts.length > 0 && (
                                <ToListButton resource="artifacts" />
                            )}
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} xl={3} zeroMinWidth>
                    <Card sx={cardStyle}>
                        <CardHeader
                            title={translate('pages.dashboard.dataitems.title')}
                            avatar={<TableChartIcon />}
                            titleTypographyProps={{
                                variant: 'h6',
                                color: 'secondary.main',
                            }}
                        />
                        <CardContent>
                            <Counter value={totalDataItems} />
                            {!!dataItems && dataItems.length > 0 ? (
                                <Recent
                                    resource="dataitems"
                                    elements={dataItems}
                                />
                            ) : (
                                <Typography
                                    sx={{ textAlign: 'center', p: '70px 0' }}
                                >
                                    <CreateButton
                                        resource="dataitems"
                                        variant="contained"
                                    />
                                </Typography>
                            )}
                        </CardContent>
                        <CardActions disableSpacing sx={{ mt: 'auto' }}>
                            {!!dataItems && dataItems.length > 0 && (
                                <ToListButton resource="dataitems" />
                            )}
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} xl={3} zeroMinWidth>
                    <Card sx={cardStyle}>
                        <CardHeader
                            title={translate('pages.dashboard.functions.title')}
                            avatar={<ElectricBoltIcon />}
                            titleTypographyProps={{
                                variant: 'h6',
                                color: 'secondary.main',
                            }}
                        />
                        <CardContent>
                            <Counter value={totalFunctions} />
                            {!!functions && functions.length > 0 ? (
                                <Recent
                                    resource="functions"
                                    elements={functions}
                                />
                            ) : (
                                <Typography
                                    sx={{ textAlign: 'center', p: '70px 0' }}
                                >
                                    <CreateButton
                                        resource="functions"
                                        variant="contained"
                                    />
                                </Typography>
                            )}
                        </CardContent>
                        <CardActions disableSpacing sx={{ mt: 'auto' }}>
                            {!!functions && functions.length > 0 && (
                                <ToListButton resource="functions" />
                            )}
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} xl={3} zeroMinWidth>
                    <Card sx={cardStyle}>
                        <CardHeader
                            title={translate('pages.dashboard.functions.title')}
                            avatar={<ElectricBoltIcon />}
                            titleTypographyProps={{
                                variant: 'h6',
                                color: 'secondary.main',
                            }}
                        />
                        <CardContent>
                            {!!functions && functions.length > 0 ? (
                                <>
                                    <RunsGrid
                                        runs={{
                                            completed: completed,
                                            running: running,
                                            error: error,
                                        }}
                                    />
                                    <Recent
                                        resource="functions"
                                        elements={functions}
                                    />
                                </>
                            ) : (
                                <Typography
                                    sx={{ textAlign: 'center', p: '70px 0' }}
                                >
                                    <CreateButton
                                        resource="functions"
                                        variant="contained"
                                    />
                                </Typography>
                            )}
                        </CardContent>
                        <CardActions disableSpacing sx={{ mt: 'auto' }}>
                            {!!functions && functions.length > 0 && (
                                <ToListButton resource="functions" />
                            )}
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>

            <Typography variant="body1" sx={{ mt: 2, pt: 1, pb: 1 }}>
                {translate('pages.dashboard.text')}
            </Typography>
        </Container>
    );
};

const Counter = (props: { value: number | undefined }) => {
    const { value } = props;
    const theme = useTheme();

    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid item md={4} zeroMinWidth key={1} textAlign={'center'}>
                <Paper
                    elevation={0}
                    sx={{
                        backgroundColor: theme.palette.background.default,
                        lineHeight: '100%',
                        aspectRatio: 1,
                        display: 'inline-grid',
                        placeItems: 'center',
                        minWidth: '5em',
                        minHeight: '5em',
                        padding: '.5em',
                        borderRadius: '50%',
                        boxSizing: 'border-box',
                    }}
                >
                    <Typography variant="h4" sx={{ textAlign: 'center' }}>
                        {value}
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
};

const ToListButton = (props: { resource: string }) => {
    const { resource } = props;

    return <ListButton resource={resource} variant="contained" />;
};

const RunsGrid = (props: {
    runs: {
        completed: number | undefined;
        running: number | undefined;
        error: number | undefined;
    };
}) => {
    const { runs } = props;
    const entries = Object.entries(runs);
    const translate = useTranslate();

    return (
        <Grid
            container
            spacing={2}
            justifyContent="center"
            sx={{ marginTop: '20px' }}
        >
            {entries.map(([k, v]) => (
                <Grid item md={entries.length} key={k} textAlign={'center'}>
                    <Paper
                        variant="outlined"
                        sx={{
                            lineHeight: '100%',
                            aspectRatio: 1,
                            display: 'inline-grid',
                            placeItems: 'center',
                            minWidth: '3em',
                            minHeight: '3em',
                            padding: '.5em',
                            borderRadius: '50%',
                            boxSizing: 'border-box',
                        }}
                    >
                        {v}
                    </Paper>
                    <Typography variant="body2" sx={{ textAlign: 'center' }}>
                        {translate(`pages.dashboard.states.${k}`)}
                    </Typography>
                </Grid>
            ))}
        </Grid>
    );
};

const Recent = (props: { resource: string; elements: any[] }) => {
    const { resource, elements } = props;
    const translate = useTranslate();
    const createPath = useCreatePath();
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <Box sx={{ mt: 2 }}>
            <Typography
                variant="body1"
                color={'secondary.light'}
                sx={{ fontWeight: 700 }}
            >
                {translate('pages.dashboard.recent') + ': '}
            </Typography>
            <MuiList sx={{ pt: 0 }}>
                {elements.slice(0, 3).map(el => (
                    <ListItem
                        disableGutters
                        key={el.id}
                        sx={{
                            p: 0,
                            '&:hover': {
                                backgroundColor:
                                    theme.palette.background.default,
                            },
                        }}
                    >
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
                        >
                            <ListItemText
                                primary={
                                    <Grid container spacing={0}>
                                        <Grid item xs={6}>
                                            <Typography color={'primary'}>
                                                {el.metadata.name || el.name}
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={6}
                                            sx={{ textAlign: 'right' }}
                                        >
                                            <Typography
                                                color={'secondary.light'}
                                            >
                                                {el.kind}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                }
                                secondary={
                                    el.metadata?.updated
                                        ? convertToDate(
                                              el.metadata.updated
                                          ).toLocaleString()
                                        : undefined
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </MuiList>
        </Box>
    );
};
