import {
    Button,
    Edit,
    EditBase,
    EditView,
    SaveButton,
    SelectInput,
    SimpleForm,
    TextInput,
    Toolbar,
    useBasename,
    useNotify,
    useRecordContext,
    useRedirect,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { useNavigate } from 'react-router';
import ClearIcon from '@mui/icons-material/Clear';
import { Container, Box, Stack } from '@mui/system';
import { MetadataSchema, MetadataEditUiSchema, ProjectMetadataSchema } from '../../common/schemas';
import { FlatCard } from '../../components/FlatCard';
import { EditPageTitle } from '../../components/PageTitle';
import { ArtifactEditToolbar } from '../artifacts';
import { ArtifactIcon } from '../artifacts/icon';
import SettingsIcon from '@mui/icons-material/Settings';
import { FormLabel } from '../../components/FormLabel';
import { JsonSchemaInput } from '../../components/JsonSchema';

export const EditToolbar = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(-1);
    };
    return (
        <Toolbar sx={{ justifyContent: 'space-between' }}>
            <SaveButton />
            <Button
                color="info"
                label={translate('buttons.cancel')}
                onClick={handleClick}
            >
                <ClearIcon />
            </Button>
        </Toolbar>
    );
};

export const ProjectEdit = () => {
    const resource = useResourceContext();
    const record = useRecordContext();
    const notify = useNotify();
    const redirect = useRedirect();
    const basename = useBasename();

    const onSuccess = (data, variables, context) => {
        notify('ra.notification.updated', {
            type: 'info',
            messageArgs: { smart_count: 1 },
        });
        redirect(`${basename}/config`);
    };

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <EditBase
                mutationMode="pessimistic"
                mutationOptions={{ onSuccess: onSuccess }}
            >
                <>
                    <EditPageTitle icon={<SettingsIcon fontSize={'large'} />} />

                    <EditView component={Box}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <SimpleForm toolbar={<EditToolbar />}>
                                <FormLabel label="fields.base" />
                                <Stack direction={'row'} spacing={3} pt={4}>
                                    <TextInput source="kind" readOnly />
                                    <TextInput source="id" readOnly />
                                </Stack>

                                <JsonSchemaInput
                                    source="metadata"
                                    schema={ProjectMetadataSchema}
                                    uiSchema={MetadataEditUiSchema}
                                />
                            </SimpleForm>
                        </FlatCard>
                    </EditView>
                </>
            </EditBase>
        </Container>
    );
};
