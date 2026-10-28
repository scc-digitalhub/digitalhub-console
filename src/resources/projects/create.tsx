// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Create,
    SimpleForm,
    TextInput,
    required,
    regex,
    useAuthProvider,
    useNotify,
    useRefresh,
} from 'react-admin';
import { MetadataSchema } from '../../common/jsonSchema/schemas';
import { FormLabel } from '../../common/components/layout/FormLabel';
import { JsonSchemaInput } from '../../common/jsonSchema/components/JsonSchema';
import { ProjectMetadataEditUiSchema } from './types';
import { CreateInDialogButton } from '@dslab/ra-dialog-crud';

const validateName = [
    required(),
    regex(/^[a-z0-9-]+$/, 'messages.validation.wrongChar'),
    (val: string) =>
        val && (val.length < 2 || val.length > 38)
            ? {
                  message: 'messages.validation.wrongLength',
                  args: { min: 2, max: 38 },
              }
            : undefined,
];

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
                onError: (error: any) => {
                    notify(error?.body?.message || error?.message, {
                        type: 'error',
                    });
                },
            }}
        >
            <ProjectCreateForm />
        </Create>
    );
};

export const ProjectCreateForm = () => {
    return (
        <SimpleForm mode="onChange">
            <FormLabel label="fields.base" />

            <TextInput source="name" validate={validateName} />

            <JsonSchemaInput
                source="metadata"
                schema={MetadataSchema}
                uiSchema={ProjectMetadataEditUiSchema}
            />
        </SimpleForm>
    );
};
export const CreateProjectButton = () => {
    const authProvider = useAuthProvider();
    const notify = useNotify();
    const refresh = useRefresh();

    const transform = data => ({
        ...data,
        kind: `project`,
    });

    return (
        <CreateInDialogButton
            fullWidth
            maxWidth={'md'}
            transform={transform}
            variant="contained"
            closeOnClickOutside={false}
            mutationOptions={{
                onSuccess: () => {
                    notify('ra.notification.created', {
                        type: 'info',
                        messageArgs: { smart_count: 1 },
                    });

                    if (authProvider) {
                        //refresh permissions
                        authProvider.refreshUser().then(() => {
                            refresh();
                        });
                    }
                },
            }}
        >
            <ProjectCreateForm />
        </CreateInDialogButton>
    );
};
//minimo name e kind, opt desc
