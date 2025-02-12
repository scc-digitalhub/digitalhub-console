import { useRootSelector } from '@dslab/ra-root-selector';
import {
    CreateBase,
    CreateView,
    ListButton,
    required,
    SimpleForm,
    TextInput,
    TopToolbar,
    useDataProvider,
    useNotify,
    useRedirect,
    useResourceContext,
} from 'react-admin';
import { isAlphaNumeric } from '../../common/helper';
import { Box, Container, Grid } from '@mui/material';
import { CreatePageTitle } from '../../components/PageTitle';
import { SecretIcon } from './icon';
import { FlatCard } from '../../components/FlatCard';
import { FormLabel } from '../../components/FormLabel';
import { useGetSchemas } from '../../controllers/schemaController';
import { SecretUiSchema } from './types';
import { SpecInput } from '../../components/SpecInput';
import { useRef } from 'react';

const CreateToolbar = () => {
    return (
        <TopToolbar>
            <ListButton />
        </TopToolbar>
    );
};

export const SecretCreate = () => {
    const { root } = useRootSelector();
    const notify = useNotify();
    const dataProvider = useDataProvider();
    const redirect = useRedirect();
    const resource = useResourceContext();
    const value = useRef<string>();
    const { data: schemas } = useGetSchemas(resource);

    //hardcoded: only 1 kind supported
    const kind = 'secret';
    const uiSchema = SecretUiSchema;
    const schema = schemas ? schemas.find(s => s.kind == kind)?.schema : {};

    const record = { kind };

    //TODO move to server or refactor
    const checkDuplicates = data => {
        if (data) {
            return dataProvider
                .getList('secrets', {
                    pagination: { perPage: 1000, page: 1 },
                    sort: { field: 'name', order: 'ASC' },
                    filter: {},
                })
                .then(list => {
                    const s = list.data.find(e => e.name === data);
                    if (s) {
                        return 'messages.validation.duplicated';
                    }

                    return undefined;
                });
        }

        return undefined;
    };

    const save = data => {
        if (data?.name && value.current) {
            const obj = { name: data?.name, value: value.current };

            return dataProvider
                .writeSecretData(obj, { root })
                .then(() => {
                    notify('ra.notification.created', {
                        type: 'info',
                        messageArgs: { smart_count: 1 },
                    });
                    redirect('list', 'secrets');
                })
                .catch(error => {
                    notify(`Error creating secret: ${error.message}`, {
                        type: 'error',
                    });
                });
        }
    };

    const transform = data => {
        value.current = data.value;

        return {
            name: data.name,
            kind,
            project: root,
            spec: {
                provider: data.spec?.provider || 'kubernetes',
                path: 'secret://' + data.name,
            },
        };
    };

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreateBase
                redirect={false}
                record={record}
                transform={transform}
                mutationOptions={{ onSuccess: save }}
            >
                <>
                    <CreatePageTitle icon={<SecretIcon fontSize={'large'} />} />

                    <CreateView component={Box} actions={<CreateToolbar />}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <SimpleForm>
                                <FormLabel label="fields.secrets.title" />
                                <SpecInput
                                    source="spec"
                                    kind={kind}
                                    schema={schema}
                                    getUiSchema={() => uiSchema}
                                    label=""
                                    helperText=""
                                />
                                <Grid container columnSpacing={1} pt={1}>
                                    <Grid item xs={4}>
                                        <TextInput
                                            source="name"
                                            fullWidth
                                            validate={[
                                                required(),
                                                isAlphaNumeric(),
                                                checkDuplicates,
                                            ]}
                                        />
                                    </Grid>
                                    <Grid item xs={8}>
                                        <TextInput
                                            source="value"
                                            required
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </SimpleForm>
                        </FlatCard>
                    </CreateView>
                </>
            </CreateBase>
        </Container>
    );
};
