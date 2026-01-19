// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import yamlExporter from '@dslab/ra-export-yaml';
import { Box, Container } from '@mui/material';
import {
    Datagrid,
    EditButton,
    ListBase,
    ListView,
    ShowButton,
    TextField,
    useResourceContext,
} from 'react-admin';

import { SecretIcon } from './icon';
import { DeleteWithConfirmButtonByName } from '../../../common/components/buttons/DeleteWithConfirmButtonByName';
import { ListPageTitle } from '../../../common/components/layout/PageTitle';
import { FlatCard } from '../../../common/components/layout/FlatCard';
import { RowButtonGroup } from '../../../common/components/buttons/RowButtonGroup';
import { BulkDeleteAllVersionsButton } from '../../../common/components/buttons/BulkDeleteAllVersionsButton';
import { useRootSelector } from '@dslab/ra-root-selector';
import { ListToolbar } from '../../../common/components/toolbars/ListToolbar';

const RowActions = () => {
    return (
        <RowButtonGroup>
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
                    <ListToolbar canImport={false} />
                    <FlatCard sx={{ pt: '9px' }}>
                        <ListView
                            actions={false}
                            component={Box}
                            sx={{ pb: 2 }}
                        >
                            <Datagrid
                                rowClick="show"
                                bulkActionButtons={
                                    <BulkDeleteAllVersionsButton />
                                }
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
