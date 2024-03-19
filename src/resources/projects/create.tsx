import { Create, SimpleForm, TextInput, required } from 'react-admin';
import { alphaNumericName } from '../../common/helper';
import {
    BlankSchema,
    MetadataCreateUiSchema,
    MetadataSchema,
} from '../../common/schemas';
import { Stack } from '@mui/material';
import { FormLabel } from '../../components/FormLabel';
import { JsonSchemaInput } from '../../components/JsonSchema';

export const ProjectCreate = () => {
    const transform = data => ({
        ...data,
        kind: `project`,
    });
    const validator = data => {
        const errors: any = {};

        if (!alphaNumericName(data.name)) {
            errors.name = 'validation.wrongChar';
        }

        return errors;
    };
    return (
        <Create transform={transform} redirect="list">
            <SimpleForm validate={validator}>
                <FormLabel label="fields.base" />

                <Stack direction={'row'} spacing={3} pt={4}>
                    <TextInput source="name" validate={required()} />
                    <TextInput
                        source="description"
                        resettable
                        multiline
                        validate={required()}
                    />
                </Stack>

                <JsonSchemaInput
                    source="metadata"
                    schema={MetadataSchema}
                    uiSchema={MetadataCreateUiSchema}
                />
            </SimpleForm>
        </Create>
    );
};
//minimo name e kind, opt desc
