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
    useResourceContext,
} from 'react-admin';

import { SecretIcon } from './icon';
import { DeleteWithConfirmButtonByName } from '../../components/buttons/DeleteWithConfirmButtonByName';
import { ListPageTitle } from '../../components/PageTitle';
import { FlatCard } from '../../components/FlatCard';
import { RowButtonGroup } from '../../components/buttons/RowButtonGroup';
import { BulkDeleteAllVersionsButton } from '../../components/buttons/BulkDeleteAllVersionsButton';
import { useRootSelector } from '@dslab/ra-root-selector';

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
    const resource = useResourceContext();
    const { root } = useRootSelector();

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ListBase
                exporter={yamlExporter}
                storeKey={`${root}.${resource}.listParams`}
            >
                <>
                    <ListPageTitle icon={<SecretIcon fontSize={'large'} />} />
                    <ListToolbar />
                    <FlatCard sx={{ pt: '9px' }}>
                        <ListView
                            actions={false}
                            component={Box}
                            sx={{ pb: 2 }}
                        >
                            <Datagrid
                                rowClick="show"
                                bulkActionButtons={<BulkDeleteAllVersionsButton />}
                            >
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
