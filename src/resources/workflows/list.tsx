import yamlExporter from '@dslab/ra-export-yaml';
import { Box, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import {
    Datagrid,
    DateField,
    EditButton,
    ListBase,
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
import { WorkflowIcon } from './icon';
import { ChipsField } from '../../components/ChipsField';
import { BulkDeleteAllVersionsButton } from '../../components/buttons/BulkDeleteAllVersionsButton';
import { useRootSelector } from '@dslab/ra-root-selector';
import { ListToolbar } from '../../components/toolbars/ListToolbar';

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

export const WorkflowList = () => {
    const resource = useResourceContext();
    const { root } = useRootSelector();
    const schemaProvider = useSchemaProvider();
    const [kinds, setKinds] = useState<any[]>();

    useEffect(() => {
        if (schemaProvider) {
            schemaProvider.kinds('workflows').then(res => {
                if (res) {
                    const values = res.map(s => ({
                        id: s,
                        name: s,
                    }));

                    setKinds(values);
                }
            });
        }
    }, [schemaProvider, setKinds]);

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
          ]
        : [];
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ListBase
                exporter={yamlExporter}
                sort={{ field: 'metadata.updated', order: 'DESC' }}
                storeKey={`${root}.${resource}.listParams`}
            >
                <>
                    <ListPageTitle icon={<WorkflowIcon fontSize={'large'} />} />
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
                                expand={VersionsList}
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
                                <RowActions />
                            </Datagrid>
                        </ListView>
                    </FlatCard>
                </>
            </ListBase>
        </Container>
    );
};
