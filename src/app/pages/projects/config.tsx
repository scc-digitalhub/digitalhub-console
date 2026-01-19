// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import { Container, Stack } from '@mui/material';
import {
    EditButton,
    Labeled,
    ResourceContextProvider,
    ShowBase,
    ShowView,
    SimpleShowLayout,
    TextField,
    TopToolbar,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import { FlatCard } from '../../../common/components/layout/FlatCard';
import { PageTitle } from '../../../common/components/layout/PageTitle';
import { ExportRecordButton } from '@dslab/ra-export-record-button';
import { InspectButton } from '@dslab/ra-inspect-button';
import SettingsIcon from '@mui/icons-material/Settings';
import { MetadataSchema } from '../../../common/jsonSchema/schemas';
import { JsonSchemaField } from '../../../common/jsonSchema/components/JsonSchema';
import { DeleteWithDialogButton } from '@dslab/ra-delete-dialog-button';
import { ProjectMetadataViewUiSchema } from './types';
import { ShareProjectButton } from '../../../common/components/buttons/ShareProjectButton';
import { useProjectPermissions } from '../../../provider/authProvider';
import { IdField } from '../../../common/components/fields/IdField';

const ShowToolbar = () => {
    const record = useRecordContext();
    const { isAdmin } = useProjectPermissions();

    if (!record) {
        return <></>;
    }

    return (
        <TopToolbar>
            {isAdmin(record.id) && (
                <EditButton style={{ marginLeft: 'auto' }} />
            )}
            <InspectButton fullWidth />
            <ExportRecordButton language="yaml" color="info" />
            {isAdmin(record.id) && <ShareProjectButton />}
            {isAdmin(record.id) && (
                <DeleteWithDialogButton
                    redirect="/projects"
                    mutationOptions={{ meta: { cascade: true } }}
                />
            )}
        </TopToolbar>
    );
};

export const ProjectConfig = () => {
    const translate = useTranslate();
    const { root: projectId } = useRootSelector();

    return (
        <ResourceContextProvider value="projects">
            <Container maxWidth={false} sx={{ pb: 2 }}>
                <ShowBase id={projectId}>
                    <>
                        <PageTitle
                            text={translate('pages.config.title')}
                            secondaryText={translate('pages.config.text')}
                            icon={<SettingsIcon fontSize={'large'} />}
                        />
                        <ShowView
                            actions={<ShowToolbar />}
                            component={FlatCard}
                        >
                            <SimpleShowLayout>
                                <TextField source="name" />

                                <Stack direction={'row'} spacing={3}>
                                    <Labeled>
                                        <TextField
                                            source="kind"
                                            label="fields.kind"
                                        />
                                    </Labeled>

                                    <Labeled>
                                        <IdField source="id" />
                                    </Labeled>
                                </Stack>

                                <IdField source="key" />

                                <JsonSchemaField
                                    source="metadata"
                                    schema={MetadataSchema}
                                    uiSchema={ProjectMetadataViewUiSchema}
                                    label={false}
                                />
                            </SimpleShowLayout>
                        </ShowView>
                    </>
                </ShowBase>
            </Container>
        </ResourceContextProvider>
    );
};
