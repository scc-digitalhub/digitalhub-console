import yamlExporter from '@dslab/ra-export-yaml';
import { Box, Container, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import {
    Datagrid,
    DateField,
    EditButton,
    ListActions,
    ListActionsProps,
    ListBase,
    ListView,
    SelectInput,
    ShowButton,
    TextField,
    TextInput,
    TopToolbar,
    useListContext,
    useResourceContext,
    useTranslate,
    sanitizeListRestProps,
    ExportButton,
    CreateButton,
    DatagridHeader,
    DatagridHeaderProps,
    useDatagridContext,
    useRecordContext,
    useExpanded,
} from 'react-admin';
import { RowButtonGroup } from '../../components/RowButtonGroup';
import { DeleteWithConfirmButtonShowingName } from '../../components/DeleteWithConfirmButtonShowingName';
import { ListPageTitle } from '../../components/PageTitle';
import { VersionsList } from '../../components/VersionsList';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { FunctionIcon } from './icon';
import { FlatCard } from '../../components/FlatCard';

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
        <Container maxWidth={false}>
            <ListBase exporter={yamlExporter}>
                <>
                    <ListPageTitle icon={<FunctionIcon fontSize={'large'} />} />
                    <ListToolbar />
                    <FlatCard>
                        <ListView
                            filters={postFilters}
                            actions={false}
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
