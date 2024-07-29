import { useRootSelector } from '@dslab/ra-root-selector';
import {
    SimpleForm,
    TextInput,
    useDataProvider,
    useNotify,
    useRedirect,
    useTranslate,
    EditBase,
    EditView,
    Toolbar,
    SaveButton,
    Button,
} from 'react-admin';
import { alphaNumericName } from '../../common/helper';
import { Box, Container, Grid } from '@mui/material';
import { EditPageTitle } from '../../components/PageTitle';
import { SecretIcon } from './icon';
import { FlatCard } from '../../components/FlatCard';
import { useNavigate } from 'react-router';
import ClearIcon from '@mui/icons-material/Clear';
import { FormLabel } from '../../components/FormLabel';

export const SecretsEditToolbar = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(-1);
    };

    return (
        <Toolbar sx={{ justifyContent: 'space-between' }}>
            <SaveButton />
            <Button
                color="info"
                label={translate('buttons.cancel')}
                onClick={handleClick}
            >
                <ClearIcon />
            </Button>
        </Toolbar>
    );
};

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
            errors.name = 'validation.wrongChar';
        }
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
                notify('ra.notification.updated', {
                    type: 'info',
                    messageArgs: { smart_count: 1 },
                });
                redirect('show', 'secrets', data.id);
            })
            .catch(error => {
                notify(`Error creating secret: ${error.message}`, {
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
                                toolbar={<SecretsEditToolbar />}
                                validate={validator}
                                onSubmit={postSave}
                                resetOptions={{ keepDirtyValues: false }}
                            >
                                <FormLabel label="fields.secrets.title" />
                                <Grid container columnSpacing={1} pt={1}>
                                    <Grid item xs={4}>
                                        <TextInput
                                            source="name"
                                            required
                                            readOnly
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
                    </EditView>
                </>
            </EditBase>
        </Container>
    );
};
