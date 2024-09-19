import { Create, SimpleForm, TextInput, required } from 'react-admin';
import { isAlphaNumeric } from '../../common/helper';
import { MetadataSchema } from '../../common/schemas';
import { FormLabel } from '../../components/FormLabel';
import { JsonSchemaInput } from '../../components/JsonSchema';
import { ProjectMetadataEditUiSchema } from './types';

export const ProjectCreate = () => {
    const transform = data => ({
        ...data,
        kind: `project`,
    });

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
