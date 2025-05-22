import { useRootSelector } from '@dslab/ra-root-selector';
import {
    List,
    Pagination,
    TopToolbar,
    useRecordContext,
    DateField,
    Labeled,
    TextField,
    useNotify,
    useRefresh,
    useAuthProvider,
    useAuthenticated,
    SortButton,
    useGetIdentity,
    TextInput,
    SelectInput,
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
    Chip,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import LockIcon from '@mui/icons-material/Lock';

import { grey } from '@mui/material/colors';
import { GridList } from '../../components/GridList';
import { CreateInDialogButton } from '@dslab/ra-dialog-crud';
import { ProjectCreateForm } from './create';
import { RowButtonGroup } from '../../components/buttons/RowButtonGroup';
import { InspectButton } from '@dslab/ra-inspect-button';
import React from 'react';
import purify from 'dompurify';
import { useProjectPermissions } from '../../provider/authProvider';
import { Empty } from '../../components/Empty';

export const ProjectSelectorList = props => {
    const perPage = 12;

    //check if auth is required to redirect to login
    useAuthenticated();
    const { data: identity } = useGetIdentity();

    const username = identity?.id || null;
    const filters = username
        ? [
              <TextInput
                  label="fields.name.title"
                  source="name"
                  alwaysOn
                  resettable
                  key={1}
              />,
              <SelectInput
                  alwaysOn
                  key={2}
                  label="fields.createdBy.title"
                  source="user"
                  choices={[
                      { id: username, name: 'pages.search.createdBy.me' },
                  ]}
                  emptyText={'pages.search.createdBy.anyone'}
                  emptyValue={''}
                  sx={{ '& .RaSelectInput-input': { margin: '0px' } }}
              />,
          ]
        : [];

    return (
        <List
            {...props}
            actions={<Toolbar />}
            component={Box}
            sort={{ field: 'updated', order: 'DESC' }}
            perPage={perPage}
            storeKey={false}
            pagination={<Pagination rowsPerPageOptions={[perPage]} />}
            filters={filters}
            empty={
                <Empty>
                    <CreateProjectButton />
                </Empty>
            }
        >
            <GridList linkType={false}>
                <ProjectsGridItem />
            </GridList>
        </List>
    );
};

export const CreateProjectButton = () => {
    const authProvider = useAuthProvider();
    const notify = useNotify();
    const refresh = useRefresh();

    const transform = data => ({
        ...data,
        kind: `project`,
    });

    return (
        <CreateInDialogButton
            fullWidth
            maxWidth={'md'}
            transform={transform}
            variant="contained"
            closeOnClickOutside={false}
            mutationOptions={{
                onSuccess: () => {
                    notify('ra.notification.created', {
                        type: 'info',
                        messageArgs: { smart_count: 1 },
                    });

                    if (authProvider) {
                        //refresh permissions
                        authProvider.refreshUser().then(user => {
                            refresh();
                        });
                    }
                },
            }}
        >
            <ProjectCreateForm />
        </CreateInDialogButton>
    );
};

const Toolbar = () => {
    return (
        <TopToolbar>
            <SortButton fields={['updated', 'name']} />
            <CreateProjectButton />
        </TopToolbar>
    );
};

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
                    avatar={
                        isAccessible ? (
                            <FolderIcon />
                        ) : (
                            <LockIcon color="disabled" />
                        )
                    }
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
    height: '280px',
    // width: '250px',
    // display: 'flex',
    // flexDirection: 'column',
    // margin: 'auto',
};
