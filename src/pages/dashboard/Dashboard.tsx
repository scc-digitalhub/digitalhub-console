import { useRootSelector } from '@dslab/ra-root-selector';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import TableChartIcon from '@mui/icons-material/TableChart';
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
    List as MuiList,
    Stack,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
    CreateButton,
    ListButton,
    LoadingIndicator,
    SortPayload,
    useDataProvider,
    useGetResourceLabel,
    useTranslate,
} from 'react-admin';
import { PageTitle } from '../../components/PageTitle';
import { Counter } from './Counter';
import { RunsGrid } from './RunsGrid';
import { convertToDate } from './helper';
import { RecentList } from './RecentList';
import { RecentRunsList } from './RecentRunList';

const DashboardCreateButton = (props: { resource: string }) => {
    const { resource } = props;

    return <CreateButton resource={resource} variant="contained" />;
};

const ToListButton = (props: { resource: string }) => {
    const { resource } = props;

    return <ListButton resource={resource} variant="text" />;
};

export const Dashboard = () => {
    const dataProvider = useDataProvider();
    const { root: projectId } = useRootSelector();
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();

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

    const resourceName = (resource: string) =>
        translate(`resources.${resource}.forcedCaseName`, {
            smart_count: 0,
            _: getResourceLabel(resource, 0),
        });

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
                            }}
                        />
                        <CardContent>
                            <Counter value={totalArtifacts} />
                            {isArtifactsArrayNotEmpty ? (
                                <RecentList
                                    resource="artifacts"
                                    elements={artifacts}
                                />
                            ) : (
                                <EmptyList resource="artifacts" />
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
                            }}
                        />
                        <CardContent>
                            <Counter value={totalDataItems} />
                            {isDataItemsArrayNotEmpty ? (
                                <RecentList
                                    resource="dataitems"
                                    elements={dataItems}
                                />
                            ) : (
                                <EmptyList resource="dataitems" />
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
                            }}
                        />
                        <CardContent>
                            <Counter value={totalFunctions} />
                            {isFunctionsArrayNotEmpty ? (
                                <RecentList
                                    resource="functions"
                                    elements={functions}
                                />
                            ) : (
                                <EmptyList resource="functions" />
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
                                <RecentRunsList elements={runs} />
                            ) : (
                                <EmptyList resource="runs" />
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

const EmptyList = (props: { resource: string }) => {
    const { resource } = props;
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();

    const resourceName = (resource: string) =>
        translate(`resources.${resource}.forcedCaseName`, {
            smart_count: 0,
            _: getResourceLabel(resource, 0),
        });

    return (
        <Typography
            variant="body1"
            color={'gray'}
            sx={{ textAlign: 'center', pt: 5 }}
        >
            {translate('ra.page.empty', {
                name: resourceName(resource),
            })}
        </Typography>
    );
};
