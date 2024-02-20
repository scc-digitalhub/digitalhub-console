import { Create, SimpleForm, TextInput, required } from 'react-admin';
import { alphaNumericName } from '../../common/helper';

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
                <TextInput source="name" validate={required()} />
                <TextInput
                    source="description"
                    resettable
                    multiline
                    validate={required()}
                />
            </SimpleForm>
        </Create>
    );
};
//minimo name e kind, opt desc
