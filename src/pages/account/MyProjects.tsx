// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { RootSelectorButton } from '@dslab/ra-root-selector';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Typography,
} from '@mui/material';
import {
    Datagrid,
    DateField,
    List,
    LoadingIndicator,
    TextField,
    TopToolbar,
    useGetIdentity,
    useGetResourceLabel,
} from 'react-admin';
import { ShareButton } from '../../components/buttons/ShareButton';
import { ChipsField } from '../../components/ChipsField';
import { RowButtonGroup } from '../../components/buttons/RowButtonGroup';
import { DeleteWithDialogButton } from '@dslab/ra-delete-dialog-button';
import { CreateProjectButton } from '../../resources/projects';

export const MyProjects = () => {
    const { data: identity, isLoading: identityLoading } = useGetIdentity();
    const getResourceLabel = useGetResourceLabel();

    if (identityLoading) {
        return <LoadingIndicator />;
    }

    return (
        <Card>
            <CardHeader
                title={
                    <Typography variant="h6">
                        {getResourceLabel('projects', 2)}
                    </Typography>
                }
            />
            <CardContent>
                <List
                    resource="projects"
                    component={Box}
                    sort={{ field: 'updated', order: 'DESC' }}
                    filter={{ user: identity?.id }}
                    storeKey={false}
                    actions={<ProjectsToolbar />}
                    disableSyncWithLocation
                >
                    <Datagrid bulkActionButtons={false} rowClick={false}>
                        <TextField
                            source="name"
                            label="fields.name.title"
                            sortable={false}
                        />
                        <DateField
                            source="metadata.updated"
                            label="fields.updated.title"
                            showDate={true}
                            showTime={true}
                            sortable={false}
                        />

                        <ChipsField
                            label="fields.labels.title"
                            source="metadata.labels"
                            sortable={false}
                        />
                        <RowButtonGroup>
                            <RootSelectorButton />
                            <ShareButton />
                            <DeleteWithDialogButton
                                redirect="/account"
                                mutationOptions={{
                                    meta: { cascade: true },
                                }}
                            />
                        </RowButtonGroup>
                    </Datagrid>
                </List>
            </CardContent>
        </Card>
    );
};

const ProjectsToolbar = () => {
    return (
        <TopToolbar>
            <CreateProjectButton />
        </TopToolbar>
    );
};
