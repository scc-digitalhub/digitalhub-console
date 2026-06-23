// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Create, SimpleForm, TextInput, required, regex } from 'react-admin';
import { FormLabel } from '../../common/components/layout/FormLabel';
import { useRootSelector } from '@dslab/ra-root-selector';

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

export const FolderCreate = () => {
    const { root } = useRootSelector();

    const transform = data => ({
        ...data,
        kind: `folder`,
        project: root,
    });

    return (
        <Create transform={transform} redirect="list">
            <FolderCreateForm />
        </Create>
    );
};

export const FolderCreateForm = () => {
    return (
        <SimpleForm mode="onChange">
            <FormLabel label="fields.base" />
            <TextInput source="name" validate={validateName} />
            <TextInput source="spec.folderId" />
        </SimpleForm>
    );
};
//minimo name e kind, opt desc
