import {
    Datagrid,
    DateField,
    DeleteWithConfirmButton,
    ListBase,
    ListView,
    SelectInput,
    ShowButton,
    TextField,
    TextInput,
    TopToolbar,
    useTranslate,
} from 'react-admin';
import { Box, Container } from '@mui/material';
import yamlExporter from '@dslab/ra-export-yaml';
import { useState, useEffect } from 'react';
import { FlatCard } from '../../components/FlatCard';
import { ListPageTitle } from '../../components/PageTitle';
import { RowButtonGroup } from '../../components/RowButtonGroup';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { InspectButton } from '@dslab/ra-inspect-button';
import { LogsButton } from '../../components/LogsButton';
import { StateChips, StateColors } from '../../components/StateChips';
import { RunIcon } from './icon';

const ListToolbar = () => {
    return <TopToolbar>{/* <CreateButton /> */}</TopToolbar>;
};

const RowActions = () => {
    return (
        <RowButtonGroup label="⋮">
            <ShowButton />
            {/* <LogsButton /> */}
            {/* <InspectButton fullWidth /> */}
            <DeleteWithConfirmButton redirect={false} />
        </RowButtonGroup>
    );
};

export const RunList = () => {
    const translate = useTranslate();
    const schemaProvider = useSchemaProvider();
    const [kinds, setKinds] = useState<any[]>();

    useEffect(() => {
        if (schemaProvider) {
            schemaProvider.kinds('runs').then(res => {
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
    for (const c in StateColors) {
        states.push({ id: c, name: translate('states.' + c.toLowerCase()) });
    }
    const postFilters = kinds
        ? [
              <TextInput
                  label="fields.name.title"
                  source="name"
                  alwaysOn
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
                  sx={{ '& .RaSelectInput-input': { margin: '0px' } }}
              />,
          ]
        : [];
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ListBase
                exporter={yamlExporter}
                sort={{ field: 'metadata.updated', order: 'DESC' }}
            >
                <>
                    <ListPageTitle icon={<RunIcon fontSize={'large'} />} />

                    <ListToolbar />

                    <FlatCard>
                        <ListView
                            filters={postFilters}
                            actions={false}
                            component={Box}
                            sx={{ pb: 2 }}
                        >
                            <Datagrid
                                rowClick={'show'}
                                bulkActionButtons={false}
                            >
                                <TextField source="id" />
                                <DateField
                                    source="metadata.created"
                                    showDate
                                    showTime
                                />
                                <DateField
                                    source="metadata.updated"
                                    showDate
                                    showTime
                                />
                                <TextField source="kind" />
                                <TextField
                                    source="spec.task"
                                    sortable={false}
                                />
                                <StateChips source="status.state" />
                                {/* <FunctionField
                                    source="status.state"
                                    render={record => (
                                        <Chip
                                            key={record.status.state}
                                            label={record.status.state}
                                            sx={{ mr: '5px' }}
                                        ></Chip>
                                    )}
                                /> */}

                                <RowActions />
                            </Datagrid>
                        </ListView>
                    </FlatCard>
                </>
            </ListBase>
        </Container>
    );
};
