import yamlExporter from '@dslab/ra-export-yaml';
import { Box, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import {
    CreateButton,
    Datagrid,
    DateField,
    EditButton,
    ExportButton,
    ListActionsProps,
    ListBase,
    ListView,
    SelectInput,
    ShowButton,
    TextField,
    TextInput,
    TopToolbar,
    useDatagridContext,
    useExpanded,
    useListContext,
    useRecordContext,
    useResourceContext,
    useTranslate
} from 'react-admin';
import { DeleteWithConfirmButtonShowingName } from '../../components/DeleteWithConfirmButtonShowingName';
import { FlatCard } from '../../components/FlatCard';
import { ListPageTitle } from '../../components/PageTitle';
import { RowButtonGroup } from '../../components/RowButtonGroup';
import { VersionsList } from '../../components/VersionsList';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { FunctionIcon } from './icon';

const ListToolbar = () => {
    return (
        <TopToolbar>
            <CreateButton
            // variant="contained"
            // label={''}
            // size="large"
            // sx={{
            //     '&.MuiButton-contained': {
            //         paddingY: '12px',
            //         paddingX: '12px',
            //     },
            //     '& .MuiButton-startIcon': { margin: 0 },
            // }}
            />
        </TopToolbar>
    );
};

const DatagridToolbar = (props: ListActionsProps) => {
    const { selectedIds = [], onUnselectItems = () => null } = props;

    const { sort, filterValues, total } = useListContext({
        ...props,
        selectedIds,
        onUnselectItems,
    });
    const resource = useResourceContext(props);

    return (
        <TopToolbar>
            <ExportButton
                disabled={total === 0}
                resource={resource}
                sort={sort}
                filterValues={filterValues}
            />
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
            <DeleteWithConfirmButtonShowingName disabled={expanded} />
        </RowButtonGroup>
    );
};

export const FunctionList = () => {
    const translate = useTranslate();
    const schemaProvider = useSchemaProvider();
    const [kinds, setKinds] = useState<any[]>();

    useEffect(() => {
        if (schemaProvider) {
            schemaProvider.kinds('functions').then(res => {
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
              <TextInput label="fields.name" source="name" alwaysOn key={1} />,
              <SelectInput
                  label="fields.kind"
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
                    <ListPageTitle icon={<FunctionIcon fontSize={'large'} />} />
                    <ListToolbar />
                    <FlatCard>
                        <ListView
                            filters={postFilters}
                            actions={<DatagridToolbar />}
                            component={Box}
                        >
                            <Datagrid
                                rowClick="show"
                                expand={VersionsList}
                                expandSingle={true}
                                bulkActionButtons={false}
                            >
                                <TextField source="name" />
                                <TextField source="kind" />
                                <DateField
                                    source="metadata.updated"
                                    showDate={true}
                                    showTime={true}
                                />
                                {/* <div style={{ display: 'flex', justifyContent: 'end' }}> */}
                                <RowActions />
                                {/* </div> */}
                            </Datagrid>
                        </ListView>
                    </FlatCard>
                </>
            </ListBase>
        </Container>
    );
};
