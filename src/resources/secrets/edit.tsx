// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import {
    SimpleForm,
    TextInput,
    useDataProvider,
    useNotify,
    useRedirect,
    EditBase,
    EditView,
} from 'react-admin';
import { alphaNumericName } from '../../common/helper';
import { Box, Container, Grid } from '@mui/material';
import { EditPageTitle } from '../../components/PageTitle';
import { SecretIcon } from './icon';
import { FlatCard } from '../../components/FlatCard';
import { FormLabel } from '../../components/FormLabel';
import { EditToolbar } from '../../components/toolbars/EditToolbar';

export const SecretEdit = () => {
    const { root } = useRootSelector();
    const notify = useNotify();
    const dataProvider = useDataProvider();
    const redirect = useRedirect();

    const validator = data => {
        const errors: any = {};

        if (!('name' in data)) {
            errors.kind = 'messages.validation.required';
        }
        if (!('value' in data)) {
            errors.kind = 'messages.validation.required';
        }

        if (!alphaNumericName(data.name)) {
            errors.name = 'messages.validation.wrongChar';
        }
        return errors;
    };

    const postSave = data => {
        const obj = { name: data?.name, value: data?.value };

        dataProvider
            .writeSecretData(obj, { root })
            .then(() => {
                notify('ra.notification.updated', {
                    type: 'info',
                    messageArgs: { smart_count: 1 },
                });
                redirect('show', 'secrets', data.id);
            })
            .catch(error => {
                notify(`Error updating secret: ${error.message}`, {
                    type: 'error',
                });
            });
    };

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <EditBase redirect="show">
                <>
                    <EditPageTitle icon={<SecretIcon fontSize={'large'} />} />

                    <EditView component={Box}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <SimpleForm
                                toolbar={<EditToolbar />}
                                validate={validator}
                                onSubmit={postSave}
                                resetOptions={{ keepDirtyValues: false }}
                            >
                                <FormLabel label="fields.secrets.title" />
                                <Grid container columnSpacing={1} pt={1}>
                                    <Grid size={4}>
                                        <TextInput
                                            source="name"
                                            required
                                            readOnly
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid size={8}>
                                        <TextInput
                                            source="value"
                                            required
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </SimpleForm>
                        </FlatCard>
                    </EditView>
                </>
            </EditBase>
        </Container>
    );
};
