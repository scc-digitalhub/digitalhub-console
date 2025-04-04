import {
    EditBase,
    EditView,
    SimpleForm,
    TextInput,
    useBasename,
    useNotify,
    useRedirect,
    useResourceDefinitions,
} from 'react-admin';
import { Container, Box, Stack } from '@mui/system';
import { MetadataSchema } from '../../common/schemas';
import { FlatCard } from '../../components/FlatCard';
import { EditPageTitle } from '../../components/PageTitle';
import SettingsIcon from '@mui/icons-material/Settings';
import { FormLabel } from '../../components/FormLabel';
import { JsonSchemaInput } from '../../components/JsonSchema';
import { ProjectMetadataEditUiSchema } from './types';
import { SpecInput } from '../../components/SpecInput';
import { useState } from 'react';
import { EditToolbar } from '../../components/toolbars/EditToolbar';

export const ProjectEdit = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const basename = useBasename();
    const resources = useResourceDefinitions();
    const [isSpecDirty, setIsSpecDirty] = useState<boolean>(false);

    const onSuccess = (data, variables, context) => {
        notify('ra.notification.updated', {
            type: 'info',
            messageArgs: { smart_count: 1 },
        });
        redirect(`${basename}/config`);
    };

    const getUiSchema = (kind: string | undefined) => {
        if (!kind) {
            return undefined;
        }

        let uiSchema = {};
        for (const resource of Object.keys(resources)) {
            uiSchema[resource] = { 'ui:widget': 'hidden' };
        }
        return uiSchema as any;
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
                                    schema={MetadataSchema}
                                    uiSchema={ProjectMetadataEditUiSchema}
                                />
                                <SpecInput
                                    source="spec"
                                    onDirty={setIsSpecDirty}
                                    getUiSchema={getUiSchema}
                                />
                            </SimpleForm>
                        </FlatCard>
                    </EditView>
                </>
            </EditBase>
        </Container>
    );
};
