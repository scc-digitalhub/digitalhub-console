import { useRootSelector } from '@dslab/ra-root-selector';
import {
    CreateActionsProps,
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
} from 'react-admin';
import { isAlphaNumeric } from '../../common/helper';
import { Box, Container, Grid } from '@mui/material';
import { CreatePageTitle } from '../../components/PageTitle';
import { SecretIcon } from './icon';
import { FlatCard } from '../../components/FlatCard';
import { FormLabel } from '../../components/FormLabel';

const CreateToolbar = (props: CreateActionsProps) => {
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

    const validator = data => {
        const errors: any = {};

        if (!('name' in data)) {
            errors.kind = 'messages.validation.required';
        }
        if (!('value' in data)) {
            errors.kind = 'messages.validation.required';
        }

        return errors;
    };

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
        const obj = { project: root || '' };
        Object.defineProperty(obj, data.name, {
            value: data.value,
            writable: true,
            configurable: true,
            enumerable: true,
        });
        return dataProvider
            .createSecret(obj)
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
    };

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreateBase redirect="list">
                <>
                    <CreatePageTitle icon={<SecretIcon fontSize={'large'} />} />

                    <CreateView component={Box} actions={<CreateToolbar />}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <SimpleForm onSubmit={save}>
                                <FormLabel label="fields.secrets.title" />
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
