// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import {
    useRecordContext,
    DateField,
    Labeled,
    TextField,
    useNotify,
} from 'react-admin';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Typography,
    Stack,
    CardActionArea,
    Chip,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import LockIcon from '@mui/icons-material/Lock';

import { grey } from '@mui/material/colors';
import { GridList } from '../../../common/components/layout/GridList';
import purify from 'dompurify';
import { useProjectPermissions } from '../../../common/provider/authProvider';
import { MetricsField } from '../../../features/k8smetrics/MetricsField';

const enableMetrics: string =
    (globalThis as any).REACT_APP_ENABLE_METRICS ||
    (process.env.REACT_APP_ENABLE_METRICS as string) ||
    false;

const PROJECT_METRICS: string =
    (globalThis as any).REACT_APP_PROJECT_METRICS ||
    (process.env.REACT_APP_PROJECT_METRICS as string) ||
    null;

export const GridView = () => {
    return (
        <GridList linkType={false}>
            <ProjectsGridItem />
        </GridList>
    );
};

const ProjectsGridItem = (props: any) => {
    const project = useRecordContext(props);
    const { selectRoot } = useRootSelector();
    const notify = useNotify();
    const { hasAccess } = useProjectPermissions();

    if (!project) return null;

    const isAccessible = hasAccess(project.id);

    const handleClick = e => {
        if (project) {
            if (!isAccessible) {
                notify('ra.notification.not_authorized', {
                    type: 'error',
                });

                return;
            }

            selectRoot(project);
        }
        e.stopPropagation();
    };

    const metadataDescription = purify.sanitize(project.metadata?.description);
    const description =
        metadataDescription?.length > 40
            ? metadataDescription.substr(0, 50) + '...'
            : metadataDescription;

    return (
        <Card
            sx={{
                height: '320px',
            }}
        >
            <CardActionArea sx={{ height: '100%' }} onClick={handleClick}>
                <CardHeader
                    title={project.name ? project.name : project.id}
                    subheader={
                        project.metadata?.name &&
                        project.metadata.name !== project.name
                            ? project.metadata.name
                            : null
                    }
                    avatar={
                        isAccessible ? (
                            <FolderIcon />
                        ) : (
                            <LockIcon color="disabled" />
                        )
                    }
                    slotProps={{
                        title: {
                            variant: 'h6',
                            color: 'secondary.main',
                        },
                    }}
                />

                <CardContent sx={{ height: '100%' }}>
                    <Typography
                        sx={{
                            mb: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '100%',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {description}
                    </Typography>

                    <Box color={grey[500]} sx={{ mb: 2 }}>
                        {project.metadata && (
                            <>
                                <Labeled>
                                    <TextField
                                        source="metadata.created_by"
                                        label="fields.createdBy.title"
                                    />
                                </Labeled>
                                {isAccessible && (
                                    <>
                                        <Stack spacing={2} direction={'row'}>
                                            <Labeled>
                                                <DateField
                                                    source="metadata.created"
                                                    label="fields.created.title"
                                                    showTime
                                                />
                                            </Labeled>
                                            <Labeled>
                                                <DateField
                                                    source="metadata.updated"
                                                    label="fields.updated.title"
                                                    showTime
                                                />
                                            </Labeled>
                                        </Stack>
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            sx={{ my: 2 }}
                                        >
                                            {project.metadata?.labels?.map(
                                                (label: string) => (
                                                    <Chip
                                                        key={label}
                                                        label={label}
                                                    />
                                                )
                                            )}
                                        </Stack>
                                    </>
                                )}
                            </>
                        )}
                    </Box>
                    {isAccessible && enableMetrics && (
                        <Box
                            sx={{ display: 'flex', justifyContent: 'flex-end' }}
                        >
                            <MetricsField
                                size="small"
                                metrics={
                                    PROJECT_METRICS
                                        ? PROJECT_METRICS.split(',')
                                        : true
                                }
                            />
                        </Box>
                    )}
                </CardContent>
            </CardActionArea>
        </Card>
    );
};
