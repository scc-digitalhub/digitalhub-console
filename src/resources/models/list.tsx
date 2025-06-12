// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import yamlExporter from '@dslab/ra-export-yaml';
import { Box, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import {
    Datagrid,
    DateField,
    EditButton,
    ListView,
    SelectInput,
    ShowButton,
    TextField,
    TextInput,
    useDatagridContext,
    useExpanded,
    useRecordContext,
    useResourceContext,
} from 'react-admin';
import { DeleteWithConfirmButtonByName } from '../../components/buttons/DeleteWithConfirmButtonByName';
import { FlatCard } from '../../components/FlatCard';
import { ListPageTitle } from '../../components/PageTitle';
import { RowButtonGroup } from '../../components/buttons/RowButtonGroup';
import { VersionsList } from '../../components/VersionsList';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { ModelIcon } from './icon';
import { ChipsField } from '../../components/ChipsField';
import { BulkDeleteAllVersionsButton } from '../../components/buttons/BulkDeleteAllVersionsButton';
import { useRootSelector } from '@dslab/ra-root-selector';
import { ListToolbar } from '../../components/toolbars/ListToolbar';
import { StateChips } from '../../components/StateChips';
import { ListBaseLive } from '../../components/ListBaseLive';

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
        <RowButtonGroup>
            <ShowButton disabled={expanded} />
            <EditButton disabled={expanded} />
            <DeleteWithConfirmButtonByName
                deleteAll
                disabled={expanded}
                askForCascade
            />
        </RowButtonGroup>
    );
};

export const ModelList = () => {
    const resource = useResourceContext();
    const { root } = useRootSelector();
    const schemaProvider = useSchemaProvider();
    const [kinds, setKinds] = useState<any[]>();

    useEffect(() => {
        if (schemaProvider) {
            schemaProvider.kinds('models').then(res => {
                if (res) {
                    const values = res.map(s => ({
                        id: s,
                        name: s,
                    }));

                    setKinds(values);
                }
            });
        }
    }, [schemaProvider]);

    const states: any[] = [];
    for (const c of ['CREATED', 'UPLOADING', 'ERROR', 'READY']) {
        states.push({
            id: c,
            name: 'states.' + c.toLowerCase(),
        });
    }

    const postFilters = kinds
        ? [
              <TextInput
                  label="fields.name.title"
                  source="q"
                  alwaysOn
                  resettable
                  key={1}
              />,
              <SelectInput
                  alwaysOn
                  key={2}
                  label="fields.kind"
                  source="kind"
                  choices={kinds}
                  sx={{ '& .RaSelectInput-input': { margin: '0px' } }}
              />,
              <SelectInput
                  alwaysOn
                  key={3}
                  label="fields.status.state"
                  source="state"
                  choices={states}
                  optionText={(choice: any) => {
                      return (
                          <StateChips
                              record={choice}
                              source="id"
                              label="name"
                          />
                      );
                  }}
                  sx={{ '& .RaSelectInput-input': { margin: '0px' } }}
              />,
          ]
        : [];

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ListBaseLive
                exporter={yamlExporter}
                sort={{ field: 'metadata.updated', order: 'DESC' }}
                storeKey={`${root}.${resource}.listParams`}
            >
                <>
                    <ListPageTitle icon={<ModelIcon fontSize={'large'} />} />

                    <ListToolbar />

                    <FlatCard>
                        <ListView
                            filters={postFilters}
                            actions={false}
                            component={Box}
                            sx={{ pb: 2 }}
                        >
                            <Datagrid
                                rowClick="show"
                                expand={<VersionsList />}
                                expandSingle={true}
                                bulkActionButtons={
                                    <BulkDeleteAllVersionsButton
                                        deleteAll
                                        askForCascade
                                    />
                                }
                            >
                                <TextField
                                    source="name"
                                    label="fields.name.title"
                                />
                                <TextField source="kind" label="fields.kind" />
                                <DateField
                                    source="metadata.updated"
                                    label="fields.updated.title"
                                    showDate={true}
                                    showTime={true}
                                />
                                <ChipsField
                                    label="fields.labels.title"
                                    source="metadata.labels"
                                    sortable={false}
                                />
                                <StateChips
                                    source="status.state"
                                    label="fields.status.state"
                                />
                                <RowActions />
                            </Datagrid>
                        </ListView>
                    </FlatCard>
                </>
            </ListBaseLive>
        </Container>
    );
};
