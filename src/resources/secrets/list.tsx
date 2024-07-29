import yamlExporter from '@dslab/ra-export-yaml';
import { Box, Container } from '@mui/material';
import {
    CreateButton,
    Datagrid,
    EditButton,
    ListBase,
    ListView,
    ShowButton,
    TextField,
    TopToolbar,
} from 'react-admin';

import { SecretIcon } from './icon';
import { DeleteWithConfirmButtonByName } from '../../components/DeleteWithConfirmButtonByName';
import { ListPageTitle } from '../../components/PageTitle';
import { FlatCard } from '../../components/FlatCard';
import { RowButtonGroup } from '../../components/RowButtonGroup';

const ListToolbar = () => {
    return (
        <TopToolbar>
            <CreateButton />
        </TopToolbar>
    );
};

const RowActions = () => {
    return (
        <RowButtonGroup label="⋮">
            <ShowButton />
            <EditButton />
            <DeleteWithConfirmButtonByName />
        </RowButtonGroup>
    );
};

export const SecretList = () => {
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ListBase exporter={yamlExporter}>
                <>
                    <ListPageTitle icon={<SecretIcon fontSize={'large'} />} />
                    <ListToolbar />
                    <FlatCard sx={{ pt: '9px' }}>
                        <ListView
                            actions={false}
                            component={Box}
                            sx={{ pb: 2 }}
                        >
                            <Datagrid rowClick="show" bulkActionButtons={false}>
                                <TextField source="name" />

                                <RowActions />
                            </Datagrid>
                        </ListView>
                    </FlatCard>
                </>
            </ListBase>
        </Container>
    );
};
