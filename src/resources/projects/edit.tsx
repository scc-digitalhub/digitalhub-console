import { Edit, SimpleForm, TextInput } from 'react-admin';

export const ProjectEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="name" disabled />
        </SimpleForm>
    </Edit>
);
