import { RootSelectorButton, useRootSelector } from '@dslab/ra-root-selector';
import { DeleteWithDialogButton } from '@dslab/ra-delete-dialog-button';
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
} from 'react-admin';
import {
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Typography,
    Stack,
    CardActionArea,
    Button,
    Menu,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import { grey } from '@mui/material/colors';
import { GridList } from '../../components/GridList';
import { CreateInDialogButton } from '@dslab/ra-dialog-crud';
import { ProjectCreateForm } from './create';
import { RowButtonGroup } from '../../components/RowButtonGroup';
import { InspectButton } from '@dslab/ra-inspect-button';
import React from 'react';
import purify from 'dompurify';

export const ProjectSelectorList = props => {
    const translate = useTranslate();
    const redirect = useRedirect();
    const theme = useTheme();
    const perPage = 8;
    const getResourceLabel = useGetResourceLabel();
    const resourceLabel = getResourceLabel('projects', 1).toLowerCase();

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
                    label={translate('pageTitle.create.title', {
                        resource: resourceLabel,
                    })}
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
    const translate = useTranslate();
    const project = useRecordContext(props);
    const { selectRoot } = useRootSelector();
    const handleClick = e => {
        if (project) {
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
                    avatar={<FolderIcon />}
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
                            <Stack spacing={2}>
                                <Labeled>
                                    <DateField
                                        source="metadata.created"
                                        showTime
                                    />
                                </Labeled>
                                <Labeled>
                                    <DateField
                                        source="metadata.updated"
                                        showTime
                                    />
                                </Labeled>
                            </Stack>
                        )}
                    </Box>
                </CardContent>
            </CardActionArea>
            <CardActions disableSpacing sx={{ mt: 'auto' }}>
                <RootSelectorButton label="ra.action.open" />
                <DeleteWithDialogButton confirmTitle="Resource Deletion" />
            </CardActions>
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
