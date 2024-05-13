import { useRootSelector } from '@dslab/ra-root-selector';
import {
    Edit,
    Labeled,
    SimpleForm,
    TextInput,
    useDataProvider,
    useNotify,
    useRedirect,
    useTranslate,
    useRecordContext,
} from 'react-admin';
import { alphaNumericName } from '../../common/helper';
import { Grid } from '@mui/material';

export const SecretEdit = () => {
    const { root } = useRootSelector();
    const translate = useTranslate();
    const notify = useNotify();
    const dataProvider = useDataProvider();
    const redirect = useRedirect();
    const record = useRecordContext();
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
                redirect('list', 'secrets');
            })
            .catch(error => {
                notify(`Error creating secret: ${error.message}`, {
                    type: 'error',
                });
            });
    };
    return (
        <Edit redirect="list">
            <SimpleForm
                validate={validator}
                onSubmit={postSave}
                resetOptions={{ keepDirtyValues: false }}
            >
                <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <Labeled label={translate('resources.secrets.name')}>
                            <TextInput source="name" required readOnly />
                        </Labeled>
                    </Grid>
                    <Grid item xs={6}>
                        <Labeled label={translate('resources.secrets.value')}>
                            <TextInput source="value" required />
                        </Labeled>
                    </Grid>
                </Grid>
            </SimpleForm>
        </Edit>
    );
};
