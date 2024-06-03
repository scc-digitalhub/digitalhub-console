import { Create, SimpleForm, TextInput, required } from 'react-admin';
import { alphaNumericName, isAlphaNumeric } from '../../common/helper';
import { MetadataSchema } from '../../common/schemas';
import { FormLabel } from '../../components/FormLabel';
import { JsonSchemaInput } from '../../components/JsonSchema';
import { ProjectMetadataEditUiSchema } from './types';

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
