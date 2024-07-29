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
    TextInput,
    TopToolbar,
    useDatagridContext,
    useExpanded,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';

import { SecretIcon } from './icon';
import { useState } from 'react';
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
    const resource = useResourceContext();
    const record = useRecordContext();
    const context = useDatagridContext();
    const [expanded] = useExpanded(
        resource,
        record.id,
        context && context.expandSingle
    );
    return (
        <RowButtonGroup label="⋮">
            <ShowButton disabled={expanded} />
            <EditButton disabled={expanded} />
            <DeleteWithConfirmButtonByName /*deleteAll disabled={expanded}*/ />
        </RowButtonGroup>
    );
};

export const SecretList = () => {
    const translate = useTranslate();
    // const [kinds, setKinds] = useState<any[]>();

    // Not supported on the backend yet
    // const postFilters = [
    //     <TextInput
    //         label={translate('search.name')}
    //         source="name"
    //         alwaysOn
    //         key={1}
    //     />,
    // ];
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ListBase exporter={yamlExporter}>
                <>
                    <ListPageTitle icon={<SecretIcon fontSize={'large'} />} />
                    <ListToolbar />
                    <FlatCard sx={{ pt: '9px'}}>
                        <ListView
                            // filters={postFilters}
                            actions={false}
                            component={Box}
                            sx={{ pb: 2 }}
                        >
                            <Datagrid rowClick="show" bulkActionButtons={false}>
                                <TextField source="name" />
                                <TextField source="spec.path" />
                                <TextField source="spec.provider" />
                                <RowActions />
                            </Datagrid>
                        </ListView>
                    </FlatCard>
                </>
            </ListBase>
        </Container>
    );
};
