import yamlExporter from '@dslab/ra-export-yaml';
import { Box, Chip, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import {
    CreateButton,
    Datagrid,
    EditButton,
    FunctionField,
    ListBase,
    ListView,
    SelectInput,
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
import { DeleteWithConfirmButtonByName } from '../../components/DeleteWithConfirmButtonByName';
import { FlatCard } from '../../components/FlatCard';
import { ListPageTitle } from '../../components/PageTitle';
import { RowButtonGroup } from '../../components/RowButtonGroup';
import { VersionsList } from '../../components/VersionsList';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { ModelIcon } from './icon';

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
            <DeleteWithConfirmButtonByName deleteAll disabled={expanded} />
        </RowButtonGroup>
    );
};

export const ModelList = () => {
    const translate = useTranslate();
    const schemaProvider = useSchemaProvider();
    const [kinds, setKinds] = useState<any[]>();

    useEffect(() => {
        if (schemaProvider) {
            schemaProvider.kinds('Models').then(res => {
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

    const postFilters = kinds
        ? [
              <TextInput
                  label={translate('search.name')}
                  source="name"
                  alwaysOn
                  key={1}
              />,
              <SelectInput
                  alwaysOn
                  key={2}
                  source="kind"
                  choices={kinds}
                  sx={{ '& .RaSelectInput-input': { margin: '0px' } }}
              />,
          ]
        : [];
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ListBase exporter={yamlExporter}>
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
                                bulkActionButtons={false}
                            >
                                <TextField source="name" />
                                <TextField source="kind" />
                                <FunctionField
                                    source="metadata.labels"
                                    render={record =>
                                        record.metadata.labels?.map(label => (
                                            <Chip
                                                key={label}
                                                label={label}
                                                sx={{ mr: '5px' }}
                                            ></Chip>
                                        ))
                                    }
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
