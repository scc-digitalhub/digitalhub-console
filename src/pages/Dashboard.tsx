import {
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Chip,
    Container,
    Grid,
    ListItem,
    ListItemButton,
    ListItemText,
    List as MuiList,
    Paper,
    Stack,
    Typography,
    useTheme,
} from '@mui/material';
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

import { useRootSelector } from '@dslab/ra-root-selector';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import TableChartIcon from '@mui/icons-material/TableChart';
import { useNavigate } from 'react-router-dom';
import { PageTitle } from '../components/PageTitle';
import { StateChips, StateColors } from '../components/StateChips';

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
    const [runs, setRuns] = useState<any[]>();

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
            dataProvider.getList('runs', params).then(res => {
                if (res.data) {
                    setRuns(res.data);
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

    const isArtifactsArrayNotEmpty = !!artifacts && artifacts.length > 0;
    const isDataItemsArrayNotEmpty = !!dataItems && dataItems.length > 0;
    const isFunctionsArrayNotEmpty = !!functions && functions.length > 0;
    const isRunsArrayNotEmpty = !!runs && runs.length > 0;

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
                <Box sx={{ pt: 0, textAlign: 'left' }}>
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
                <Grid item xs={12} sm={12} md={6} xl={3} zeroMinWidth>
                    <Card sx={cardStyle}>
                        <CardHeader
                            title={translate('pages.dashboard.artifacts.title')}
                            avatar={<InsertDriveFileIcon />}
                            titleTypographyProps={{
                                variant: 'h5',
                                color: 'secondary.main',
                                fontWeight: 'bold',
                            }}
                        />
                        <CardContent>
                            <Counter value={totalArtifacts} />
                            {isArtifactsArrayNotEmpty ? (
                                <Recent
                                    resource="artifacts"
                                    elements={artifacts}
                                />
                            ) : (
                                <Typography
                                    variant="h6"
                                    sx={{ textAlign: 'center', p: '70px 0' }}
                                >
                                    {translate(
                                        'pages.dashboard.artifacts.empty'
                                    )}
                                </Typography>
                            )}
                        </CardContent>
                        <CardActions
                            disableSpacing
                            sx={{
                                mt: 'auto',
                                justifyContent: isArtifactsArrayNotEmpty
                                    ? 'left'
                                    : 'center',
                            }}
                        >
                            {isArtifactsArrayNotEmpty ? (
                                <ToListButton resource="artifacts" />
                            ) : (
                                <DashboardCreateButton resource="artifacts" />
                            )}
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={12} md={6} xl={3} zeroMinWidth>
                    <Card sx={cardStyle}>
                        <CardHeader
                            title={translate('pages.dashboard.dataitems.title')}
                            avatar={<TableChartIcon />}
                            titleTypographyProps={{
                                variant: 'h5',
                                color: 'secondary.main',
                                fontWeight: 'bold',
                            }}
                        />
                        <CardContent>
                            <Counter value={totalDataItems} />
                            {isDataItemsArrayNotEmpty ? (
                                <Recent
                                    resource="dataitems"
                                    elements={dataItems}
                                />
                            ) : (
                                <Typography
                                    variant="h6"
                                    sx={{ textAlign: 'center', p: '70px 0' }}
                                >
                                    {translate(
                                        'pages.dashboard.dataitems.empty'
                                    )}
                                </Typography>
                            )}
                        </CardContent>
                        <CardActions
                            disableSpacing
                            sx={{
                                mt: 'auto',
                                justifyContent: isDataItemsArrayNotEmpty
                                    ? 'left'
                                    : 'center',
                            }}
                        >
                            {isDataItemsArrayNotEmpty ? (
                                <ToListButton resource="dataitems" />
                            ) : (
                                <DashboardCreateButton resource="dataitems" />
                            )}
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={12} md={6} xl={3} zeroMinWidth>
                    <Card sx={cardStyle}>
                        <CardHeader
                            title={translate('pages.dashboard.functions.title')}
                            avatar={<ElectricBoltIcon />}
                            titleTypographyProps={{
                                variant: 'h5',
                                color: 'secondary.main',
                                fontWeight: 'bold',
                            }}
                        />
                        <CardContent>
                            <Counter value={totalFunctions} />
                            {isFunctionsArrayNotEmpty ? (
                                <Recent
                                    resource="functions"
                                    elements={functions}
                                />
                            ) : (
                                <Typography
                                    variant="h6"
                                    sx={{ textAlign: 'center', p: '70px 0' }}
                                >
                                    {translate(
                                        'pages.dashboard.functions.empty'
                                    )}
                                </Typography>
                            )}
                        </CardContent>
                        <CardActions
                            disableSpacing
                            sx={{
                                mt: 'auto',
                                justifyContent: isFunctionsArrayNotEmpty
                                    ? 'left'
                                    : 'center',
                            }}
                        >
                            {isFunctionsArrayNotEmpty ? (
                                <ToListButton resource="functions" />
                            ) : (
                                <DashboardCreateButton resource="functions" />
                            )}
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={12} md={6} xl={3} zeroMinWidth>
                    <Card sx={cardStyle}>
                        <CardHeader
                            title={translate('pages.dashboard.runs.title')}
                            avatar={<DirectionsRunIcon />}
                            titleTypographyProps={{
                                variant: 'h5',
                                color: 'secondary.main',
                                fontWeight: 'bold',
                            }}
                        />
                        <CardContent>
                            <RunsGrid
                                runs={{
                                    completed: completed,
                                    running: running,
                                    error: error,
                                }}
                            />
                            {isRunsArrayNotEmpty ? (
                                <Recent resource="runs" elements={runs} />
                            ) : (
                                <Typography
                                    variant="h6"
                                    sx={{ textAlign: 'center', p: '70px 0' }}
                                >
                                    {translate('pages.dashboard.runs.empty')}
                                </Typography>
                            )}
                        </CardContent>
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
        <Grid container justifyContent="center">
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

const DashboardCreateButton = (props: { resource: string }) => {
    const { resource } = props;

    return <CreateButton resource={resource} variant="contained" />;
};

const ToListButton = (props: { resource: string }) => {
    const { resource } = props;

    return <ListButton resource={resource} variant="text" />;
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
        <Grid container justifyContent="center" height="5em">
            {entries.map(([k, v]) => (
                <Grid
                    item
                    xs={true}
                    key={k}
                    textAlign={'center'}
                    minWidth={'5em'}
                >
                    <Paper
                        variant="outlined"
                        sx={{
                            backgroundColor: `${
                                StateColors[k.toUpperCase()]
                            }.main`,
                            color: `${
                                StateColors[k.toUpperCase()]
                            }.contrastText`,
                            lineHeight: '100%',
                            aspectRatio: 1,
                            display: 'inline-grid',
                            placeItems: 'center',
                            minWidth: '3.2em',
                            minHeight: '3.2em',
                            padding: '.5em',
                            borderRadius: '50%',
                            boxSizing: 'border-box',
                        }}
                    >
                        {v}
                    </Paper>
                    <Typography
                        variant="body2"
                        sx={{ textAlign: 'center' }}
                        pt={0.5}
                    >
                        {translate(`pages.dashboard.states.${k}`)}
                    </Typography>
                </Grid>
            ))}
        </Grid>
    );
};

const Recent = (props: { resource: string; elements: any[] }) => {
    const { resource, ...rest } = props;
    const translate = useTranslate();

    return (
        <Box sx={{ mt: 2 }}>
            <Typography
                variant="h6"
                color={'secondary.light'}
                fontWeight="bold"
            >
                {translate('pages.dashboard.recent') + ': '}
            </Typography>
            {resource === 'runs' ? (
                <RecentRunsList {...rest} />
            ) : (
                <RecentList resource={resource} {...rest} />
            )}
        </Box>
    );
};

const RecentList = (props: { resource: string; elements: any[] }) => {
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

const RecentRunsList = (props: { elements: any[] }) => {
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
