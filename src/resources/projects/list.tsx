import { useRootSelector } from '@dslab/ra-root-selector';
import {
    List,
    Pagination,
    TopToolbar,
    useRecordContext,
    useTranslate,
    useRedirect,
    useTheme,
    useGetResourceLabel,
    DateField,
    Labeled,
    TextField,
    useNotify,
    useRefresh,
    useAuthProvider,
} from 'react-admin';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Typography,
    Stack,
    CardActionArea,
    Button,
    Menu,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import LockIcon from '@mui/icons-material/Lock';

import { grey } from '@mui/material/colors';
import { GridList } from '../../components/GridList';
import { CreateInDialogButton } from '@dslab/ra-dialog-crud';
import { ProjectCreateForm } from './create';
import { RowButtonGroup } from '../../components/RowButtonGroup';
import { InspectButton } from '@dslab/ra-inspect-button';
import React from 'react';
import purify from 'dompurify';
import { useProjectPermissions } from '../../provider/authProvider';

export const ProjectSelectorList = props => {
    const translate = useTranslate();
    const redirect = useRedirect();
    const theme = useTheme();
    const perPage = 8;
    const getResourceLabel = useGetResourceLabel();
    const resourceLabel = getResourceLabel('projects', 1).toLowerCase();
    const authProvider = useAuthProvider();
    const notify = useNotify();
    const refresh = useRefresh();

    const Toolbar = () => {
        const transform = data => ({
            ...data,
            kind: `project`,
        });

        return (
            <TopToolbar>
                <CreateInDialogButton
                    fullWidth
                    maxWidth={'md'}
                    transform={transform}
                    variant="contained"
                    mutationOptions={{
                        onSuccess: () => {
                            notify('ra.notification.created', {
                                type: 'info',
                                messageArgs: { smart_count: 1 },
                            });

                            if (authProvider) {
                                //refresh permissions
                                authProvider.refreshUser().then(user => {
                                    console.log('refreshed', user);
                                    refresh();
                                });
                            }
                        },
                    }}
                >
                    <ProjectCreateForm />
                </CreateInDialogButton>
            </TopToolbar>
        );
    };

    return (
        <List
            {...props}
            actions={<Toolbar />}
            component={Box}
            sort={{ field: 'updated', order: 'DESC' }}
            perPage={perPage}
            storeKey={false}
            pagination={<Pagination rowsPerPageOptions={[perPage]} />}
        >
            <GridList linkType={false}>
                <ProjectsGridItem />
            </GridList>
        </List>
    );
};

function convertToDate(value) {
    if (typeof value === 'string' || typeof value === 'number') {
        return new Date(value);
    }
    return value;
}

const ProjectsGridItem = (props: any) => {
    const project = useRecordContext(props);
    const { selectRoot } = useRootSelector();
    const notify = useNotify();
    const { hasAccess } = useProjectPermissions();

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
        <Card sx={cardStyle}>
            <CardActionArea sx={{ height: '100%' }} onClick={handleClick}>
                <CardHeader
                    title={project.name ? project.name : project.id}
                    subheader={
                        project.metadata?.name &&
                        project.metadata.name !== project.name
                            ? project.metadata.name
                            : null
                    }
                    avatar={isAccessible ? <FolderIcon /> : <LockIcon />}
                    titleTypographyProps={{
                        variant: 'h6',
                        color: 'secondary.main',
                    }}
                    // action={<RowActions />}
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
                    {isAccessible && (
                        <Box color={grey[500]} sx={{ mb: 2 }}>
                            {project.metadata && (
                                <>
                                    <Labeled>
                                        <TextField
                                            source="metadata.created_by"
                                            label="fields.createdBy.title"
                                        />
                                    </Labeled>
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
                                </>
                            )}
                        </Box>
                    )}
                </CardContent>
            </CardActionArea>
            {/* <CardActions disableSpacing sx={{ mt: 'auto' }}>
                <RootSelectorButton label="ra.action.open" />
                <DeleteWithDialogButton confirmTitle="Resource Deletion" />
            </CardActions> */}
        </Card>
    );
};

//TODO definire meglio dropdown
const RowActions = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                color="secondary"
                sx={{ textAlign: 'right', justifyContent: 'end' }}
            >
                {'⋮'}
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <RowButtonGroup>
                    <InspectButton label="" />
                </RowButtonGroup>
            </Menu>
        </>
    );
};

const cardStyle = {
    height: '250px',
    // width: '250px',
    // display: 'flex',
    // flexDirection: 'column',
    // margin: 'auto',
};
