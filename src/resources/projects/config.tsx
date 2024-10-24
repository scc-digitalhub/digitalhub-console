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
import { MetadataSchema } from '../../common/schemas';
import { JsonSchemaField } from '../../components/JsonSchema';
import { DeleteWithDialogButton } from '@dslab/ra-delete-dialog-button';
import { ProjectMetadataViewUiSchema } from './types';
import { ShareButton } from '../../components/ShareButton';
import { useProjectPermissions } from '../../provider/authProvider';
import { IdField } from '../../components/IdField';

const ShowToolbar = () => {
    const record = useRecordContext();
    const { isAdmin } = useProjectPermissions();

    if (!record) {
        return <></>;
    }

    return (
        <TopToolbar>
            <EditButton style={{ marginLeft: 'auto' }} />
            <InspectButton fullWidth />
            <ExportRecordButton language="yaml" color="info" />
            {isAdmin(record.id) && <ShareButton />}
            <DeleteWithDialogButton redirect="/projects" />
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
