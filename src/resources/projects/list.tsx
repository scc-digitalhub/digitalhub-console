import { RootSelectorButton } from '@dslab/ra-root-selector';
import { DeleteWithDialogButton } from '@dslab/ra-delete-dialog-button';
import {
    CreateButton,
    Datagrid,
    List,
    TextField,
    TopToolbar,
} from 'react-admin';

export const ProjectSelectorList = props => {
    const Toolbar = () => {
        return (
            <TopToolbar>
                <CreateButton />
            </TopToolbar>
        );
    };

    return (
        <List {...props} actions={<Toolbar />} perPage={50}>
            <Datagrid rowClick={false} bulkActionButtons={false}>
                <TextField source="name" />
                <TextField source="description" />
                <RootSelectorButton />
                <DeleteWithDialogButton confirmTitle="Resource Deletion" />
            </Datagrid>
        </List>
    );
};
