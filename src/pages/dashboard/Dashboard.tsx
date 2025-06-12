// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import DashboardIcon from '@mui/icons-material/Dashboard';

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
    ListButton,
    LoadingIndicator,
    ResourceContextProvider,
    SortPayload,
    useDataProvider,
    useTranslate,
} from 'react-admin';
import { PageTitle } from '../../components/PageTitle';
import { RunsGrid } from './RunsGrid';
import { convertToDate } from './helper';
import { RunIcon } from '../../resources/runs/icon';
import { CreateDropDownButton } from './CreateDropdownButton';
import { OverviewCard } from './OverviewCard';
import { ShareButton } from '../../components/buttons/ShareButton';
import { useProjectPermissions } from '../../provider/authProvider';

export const Dashboard = () => {
    const dataProvider = useDataProvider();
    const { root: projectId } = useRootSelector();
    const translate = useTranslate();
    const { isAdmin } = useProjectPermissions();

    const [project, setProject] = useState<any>();

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
            <PageTitle
                text={project.metadata ? project.metadata.name : project.id}
                secondaryText={project.metadata?.description}
                icon={<DashboardIcon fontSize={'large'} />}
                // icon={
                //     <>
                //         <DashboardIcon fontSize={'large'} />
                //         <CreateDropDownButton
                //             resources={[
                //                 'functions',
                //                 'models',
                //                 'dataitems',
                //                 'artifacts',
                //             ]}
                //         />
                //     </>
                // }
                sx={{ pl: 0, pr: 0 }}
            />
            <Box sx={{ pt: 0, textAlign: 'left' }}>
                {project.metadata && (
                    <MuiList sx={{ pt: 0 }}>
                        {project.user && (
                            <ListItem disableGutters sx={{ pt: 0 }}>
                                {translate('fields.createdBy.title')}{' '}
                                {project.user}
                            </ListItem>
                        )}
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
            <Stack
                direction="row"
                justifyContent="flex-end"
                spacing={2}
                sx={{ mb: 2 }}
            >
                {isAdmin(project.id) && (
                    <ResourceContextProvider value="projects">
                        <ShareButton
                            variant="contained"
                            record={project}
                        />
                    </ResourceContextProvider>
                )}
                <CreateDropDownButton
                    resources={[
                        'functions',
                        'models',
                        'dataitems',
                        'workflows',
                    ]}
                />
            </Stack>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} xl={12} zeroMinWidth>
                    <Card sx={cardStyle}>
                        <CardHeader
                            title={translate('pages.dashboard.runs.title')}
                            avatar={<RunIcon />}
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
                        </CardContent>
                        <CardActions
                            disableSpacing
                            sx={{
                                mt: 'auto',
                                justifyContent: 'left',
                            }}
                        >
                            <ListButton resource={'runs'} variant="text" />
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={12} md={6} xl={3} zeroMinWidth>
                    <OverviewCard resource="functions" />
                </Grid>
                <Grid item xs={12} sm={12} md={6} xl={3} zeroMinWidth>
                    <OverviewCard resource="models" />
                </Grid>
                <Grid item xs={12} sm={12} md={6} xl={3} zeroMinWidth>
                    <OverviewCard resource="dataitems" />
                </Grid>

                <Grid item xs={12} sm={12} md={6} xl={3} zeroMinWidth>
                    <OverviewCard resource="workflows" />
                </Grid>
            </Grid>

            <Typography variant="body1" sx={{ mt: 2, pt: 1, pb: 1 }}>
                {translate('pages.dashboard.text')}
            </Typography>
        </Container>
    );
};
