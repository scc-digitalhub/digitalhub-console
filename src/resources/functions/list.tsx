import yamlExporter from '@dslab/ra-export-yaml';
import { Box, Container } from '@mui/material';
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
} from 'react-admin';
import { RowButtonGroup } from '../../components/RowButtonGroup';
import { DeleteWithConfirmButtonShowingName } from '../../components/DeleteWithConfirmButtonShowingName';
import { ListPageTitle } from '../../components/PageTitle';
import { VersionsList } from '../../components/VersionsList';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { FunctionIcon } from './icon';

const ListToolbar = (props: ListActionsProps) => {
    const {
        className,
        filters: filtersProp,
        hasCreate: _,
        selectedIds = [],
        onUnselectItems = () => null,
        ...rest
    } = props;

    const {
        sort,
        displayedFilters,
        filterValues,
        exporter,
        showFilter,
        total,
    } = useListContext({ ...props, selectedIds, onUnselectItems });
    const resource = useResourceContext(props);

    return (
        <TopToolbar {...sanitizeListRestProps(rest)}>
            <CreateButton variant="contained" />
            <ExportButton
                disabled={total === 0}
                resource={resource}
                sort={sort}
                filterValues={filterValues}
            />
        </TopToolbar>
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
                    <ListView
                        filters={postFilters}
                        actions={<ListToolbar />}
                        component={Box}
                    >
                        <Datagrid
                            rowClick="show"
                            expand={VersionsList}
                            expandSingle={true}
                        >
                            <TextField source="name" />
                            <TextField source="kind" />
                            <DateField
                                source="metadata.updated"
                                showDate={true}
                                showTime={true}
                            />
                            {/* <div style={{ display: 'flex', justifyContent: 'end' }}> */}
                            <RowButtonGroup>
                                <ShowButton />
                                <EditButton />
                                <DeleteWithConfirmButtonShowingName />
                            </RowButtonGroup>
                            {/* </div> */}
                        </Datagrid>
                    </ListView>
                </>
            </ListBase>
        </Container>
    );
};
