import {
    Datagrid,
    DateField,
    DeleteWithConfirmButton,
    FunctionField,
    ListBase,
    ListView,
    SelectInput,
    ShowButton,
    TextField,
    TextInput,
    TopToolbar,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { Box, Container } from '@mui/material';
import yamlExporter from '@dslab/ra-export-yaml';
import { useState, useEffect } from 'react';
import { FlatCard } from '../../components/FlatCard';
import { ListPageTitle } from '../../components/PageTitle';
import { RowButtonGroup } from '../../components/RowButtonGroup';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { StateChips, StateColors } from '../../components/StateChips';
import { RunIcon } from './icon';
import { BulkDeleteAllVersions } from '../../components/BulkDeleteAllVersions';
import { useRootSelector } from '@dslab/ra-root-selector';
import { functionParser, keyParser, taskParser } from '../../common/helper';

const ListToolbar = () => {
    return <TopToolbar />;
};

const RowActions = () => {
    return (
        <RowButtonGroup label="⋮">
            <ShowButton />
            <DeleteWithConfirmButton redirect={false} />
        </RowButtonGroup>
    );
};

export const RunList = () => {
    const translate = useTranslate();
    const resource = useResourceContext();
    const { root } = useRootSelector();
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
                                bulkActionButtons={<BulkDeleteAllVersions />}
                            >
                                <TextField source="id" label="fields.id" />
                                <DateField
                                    source="metadata.created"
                                    label="fields.created.title"
                                    showDate
                                    showTime
                                />
                                <DateField
                                    source="metadata.updated"
                                    label="fields.updated.title"
                                    showDate
                                    showTime
                                />
                                <FunctionField
                                    source="spec.function"
                                    label="fields.function.title"
                                    sortable={false}
                                    render={record => {
                                        if (record?.spec?.function) {
                                            return (
                                                <>
                                                    {
                                                        functionParser(
                                                            record.spec.function
                                                        ).name
                                                    }
                                                </>
                                            );
                                        }

                                        if (record?.spec?.workflow) {
                                            return (
                                                <>
                                                    {
                                                        functionParser(
                                                            record.spec.workflow
                                                        ).name
                                                    }
                                                </>
                                            );
                                        }

                                        return <></>;
                                    }}
                                />
                                <TextField source="kind" label="fields.kind" />

                                <FunctionField
                                    source="spec.task"
                                    label="fields.task.title"
                                    sortable={false}
                                    render={record =>
                                        record?.spec?.task ? (
                                            <>
                                                {
                                                    taskParser(record.spec.task)
                                                        .kind
                                                }
                                            </>
                                        ) : (
                                            <></>
                                        )
                                    }
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
            </ListBase>
        </Container>
    );
};
