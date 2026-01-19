// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

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
import { FlatCard } from '../../../common/components/layout/FlatCard';
import { EditPageTitle } from '../../../common/components/layout/PageTitle';
import SettingsIcon from '@mui/icons-material/Settings';
import { FormLabel } from '../../../common/components/layout/FormLabel';
import { ProjectMetadataEditUiSchema } from './types';
import { SpecInput } from '../../../common/jsonSchema/components/SpecInput';
import { useEffect, useState } from 'react';
import { EditToolbar } from '../../../common/components/toolbars/EditToolbar';
import { useSchemaProvider } from '../../../provider/schemaProvider';
import { MetadataSchema } from '../../../common/jsonSchema/schemas';
import { JsonSchemaInput } from '../../../common/jsonSchema/components/JsonSchema';

export const ProjectEdit = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const basename = useBasename();
    const resources = useResourceDefinitions();
    const schemaProvider = useSchemaProvider();
    const [isSpecDirty, setIsSpecDirty] = useState<boolean>(false);
    const [schema, setSchema] = useState<any>();

    useEffect(() => {
        if (schemaProvider) {
            schemaProvider.get('projects', 'project').then(s => {
                setSchema(s.schema);
            });
        }
    }, [schemaProvider]);

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
                                {schema && (
                                    <SpecInput
                                        source="spec"
                                        kind="project"
                                        schema={schema}
                                        onDirty={setIsSpecDirty}
                                        getUiSchema={getUiSchema}
                                    />
                                )}
                            </SimpleForm>
                        </FlatCard>
                    </EditView>
                </>
            </EditBase>
        </Container>
    );
};
