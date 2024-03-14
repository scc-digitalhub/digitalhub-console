import { useRootSelector } from '@dslab/ra-root-selector';
import { Container, Stack } from '@mui/material';
import { useState, useEffect } from 'react';
import {
    DeleteWithConfirmButton,
    EditButton,
    Labeled,
    RecordContextProvider,
    ResourceContextProvider,
    ShowBase,
    ShowView,
    TextField,
    TopToolbar,
    useDataProvider,
    useTranslate,
} from 'react-admin';
import { FlatCard } from '../../components/FlatCard';
import { PageTitle, ShowPageTitle } from '../../components/PageTitle';
import { FunctionIcon } from '../functions/icon';
import { ProjectIcon } from './icon';
import { BackButton } from '@dslab/ra-back-button';
import { ExportRecordButton } from '@dslab/ra-export-record-button';
import { InspectButton } from '@dslab/ra-inspect-button';
import SettingsIcon from '@mui/icons-material/Settings';
import { JsonSchemaField } from '@dslab/ra-jsonschema-input';
import {
    MetadataSchema,
    MetadataViewUiSchema,
    createMetadataViewUiSchema,
} from '../../common/schemas';

const ShowToolbar = () => (
    <TopToolbar>
        <BackButton />
        <EditButton style={{ marginLeft: 'auto' }} />
        <InspectButton />
        <ExportRecordButton language="yaml" color="info" />
        <DeleteWithConfirmButton />
    </TopToolbar>
);

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
                            <TextField source="name" />

                            <Stack direction={'row'} spacing={3}>
                                <Labeled>
                                    <TextField source="kind" />
                                </Labeled>

                                <Labeled>
                                    <TextField source="id" />
                                </Labeled>
                            </Stack>

                            <TextField source="key" />

                            <JsonSchemaField
                                source="metadata"
                                schema={MetadataSchema}
                                uiSchema={MetadataViewUiSchema}
                                label={false}
                            />
                        </ShowView>
                    </>
                </ShowBase>
            </Container>
        </ResourceContextProvider>
    );
};
