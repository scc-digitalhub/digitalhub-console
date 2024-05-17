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
import { FlatCard } from '../../components/FlatCard';
import { PageTitle } from '../../components/PageTitle';
import { BackButton } from '@dslab/ra-back-button';
import { ExportRecordButton } from '@dslab/ra-export-record-button';
import { InspectButton } from '@dslab/ra-inspect-button';
import SettingsIcon from '@mui/icons-material/Settings';
import { MetadataViewUiSchema, ProjectMetadataSchema } from '../../common/schemas';
import { JsonSchemaField } from '../../components/JsonSchema';
import { DeleteWithDialogButton } from '@dslab/ra-delete-dialog-button';

const ShowToolbar = () => {
    const record = useRecordContext();

    if (!record) {
        return <></>;
    }

    return (
        <TopToolbar>
            <BackButton />
            <EditButton style={{ marginLeft: 'auto' }} />
            <InspectButton />
            <ExportRecordButton language="yaml" color="info" />
            <DeleteWithDialogButton />
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
                                        <TextField source="kind" />
                                    </Labeled>

                                    <Labeled>
                                        <TextField source="id" />
                                    </Labeled>
                                </Stack>

                                <TextField source="key" />

                                <JsonSchemaField
                                    source="metadata"
                                    schema={ProjectMetadataSchema}
                                    uiSchema={MetadataViewUiSchema}
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
