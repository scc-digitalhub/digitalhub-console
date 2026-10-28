// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    EditBase,
    EditView,
    SimpleForm,
    TextInput,
    useNotify,
    RedirectionSideEffect,
    useRedirect,
    useResourceDefinitions,
} from 'react-admin';
import { Box, Stack } from '@mui/system';
import { FlatCard } from '../../common/components/layout/FlatCard';
import { FormLabel } from '../../common/components/layout/FormLabel';
import { ProjectMetadataEditUiSchema } from '../../resources/projects/types';
import { SpecInput } from '../../common/jsonSchema/components/SpecInput';
import {
    JSXElementConstructor,
    ReactElement,
    useEffect,
    useState,
} from 'react';
import { EditToolbar } from '../../common/components/toolbars/EditToolbar';
import { useSchemaProvider } from '../../common/provider/schemaProvider';
import { MetadataSchema } from '../../common/jsonSchema/schemas';
import { JsonSchemaInput } from '../../common/jsonSchema/components/JsonSchema';

export const ProjectEdit = (props: {
    redirect?: RedirectionSideEffect;
    actions?:
        | false
        | ReactElement<any, string | JSXElementConstructor<any>>
        | undefined;
}) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const resources = useResourceDefinitions();
    const schemaProvider = useSchemaProvider();
    const [schema, setSchema] = useState<any>();

    useEffect(() => {
        if (schemaProvider) {
            schemaProvider.get('projects', 'project').then(s => {
                setSchema(s.schema);
            });
        }
    }, [schemaProvider]);

    const onSuccess = () => {
        notify('ra.notification.updated', {
            type: 'info',
            messageArgs: { smart_count: 1 },
        });

        redirect(props.redirect ?? 'list', 'projects');
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
        <EditBase
            mutationMode="pessimistic"
            mutationOptions={{ onSuccess: onSuccess }}
        >
            <EditView component={Box} actions={props.actions}>
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
                                uiSchema={getUiSchema(schema)}
                            />
                        )}
                    </SimpleForm>
                </FlatCard>
            </EditView>
        </EditBase>
    );
};
