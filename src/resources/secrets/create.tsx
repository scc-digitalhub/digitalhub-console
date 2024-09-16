import { useRootSelector } from '@dslab/ra-root-selector';
import {
    CreateActionsProps,
    CreateBase,
    CreateView,
    ListButton,
    SimpleForm,
    TextInput,
    TopToolbar,
    useDataProvider,
    useNotify,
    useRedirect,
} from 'react-admin';
import { alphaNumericName } from '../../common/helper';
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

        // if (!alphaNumericName(data.name)) {
        //     errors.name = 'validation.wrongChar';
        // }
        return errors;
    };

    const postSave = data => {
        const obj = { project: root || '' };
        Object.defineProperty(obj, data.name, {
            value: data.value,
            writable: true,
            configurable: true,
            enumerable: true,
        });
        dataProvider
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
                            <SimpleForm
                                validate={validator}
                                onSubmit={postSave}
                            >
                                <FormLabel label="fields.secrets.title" />
                                <Grid container columnSpacing={1} pt={1}>
                                    <Grid item xs={4}>
                                        <TextInput
                                            source="name"
                                            required
                                            fullWidth
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
