// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Create,
    SimpleForm,
    TextInput,
    required,
    useAuthProvider,
    useNotify,
} from 'react-admin';
import { isAlphaNumeric } from '../../common/helper';
import { MetadataSchema } from '../../common/schemas';
import { FormLabel } from '../../components/FormLabel';
import { JsonSchemaInput } from '../../components/JsonSchema';
import { ProjectMetadataEditUiSchema } from './types';

export const ProjectCreate = () => {
    const authProvider = useAuthProvider();
    const notify = useNotify();

    const transform = data => ({
        ...data,
        kind: `project`,
    });

    return (
        <Create
            transform={transform}
            redirect="list"
            mutationOptions={{
                onSuccess: () => {
                    notify('ra.notification.created', {
                        type: 'info',
                        messageArgs: { smart_count: 1 },
                    });

                    if (authProvider) {
                        //refresh permissions
                        authProvider.refreshUser().then(user => {
                            console.log('refreshed', user);
                        });
                    }
                },
            }}
        >
            <ProjectCreateForm />
        </Create>
    );
};

export const ProjectCreateForm = () => {
    return (
        <SimpleForm>
            <FormLabel label="fields.base" />

            <TextInput
                source="name"
                validate={[required(), isAlphaNumeric()]}
            />

            <JsonSchemaInput
                source="metadata"
                schema={MetadataSchema}
                uiSchema={ProjectMetadataEditUiSchema}
            />
        </SimpleForm>
    );
};
//minimo name e kind, opt desc
