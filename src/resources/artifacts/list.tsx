import yamlExporter from '@dslab/ra-export-yaml';
import {
    Container,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Table as MaterialTable,
} from '@mui/material';
import {
    Datagrid,
    DateField,
    EditButton,
    ListBase,
    ListView,
    RaRecord,
    SelectInput,
    ShowButton,
    TextField,
    TextInput,
    useDataProvider,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { ListPageTitle } from '../../components/PageTitle';
import { ArtifactIcon } from './icon';
import { ArtifactTypes } from './types';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { useState, useEffect } from 'react';
import { useRootSelector } from '@dslab/ra-root-selector';
import { DeleteWithConfirmButtonShowingName } from '../../components/DeleteWithConfirmButtonShowingName';

export const ListVersion = () => {
    const record = useRecordContext();
    const resource = useResourceContext();
    const dataProvider = useDataProvider();
    const { root } = useRootSelector();
    const translate = useTranslate();
    const [versions, setVersions] = useState<RaRecord>();

    useEffect(() => {
        if (dataProvider) {
            dataProvider
                .getLatest(resource, { record, root })
                .then(versions => {
                    setVersions(versions.data);
                });
        }
    }, [dataProvider, record, resource]);

    if (!versions || !record || !dataProvider) return <></>;
    return (
        <MaterialTable>
            <TableHead>
                <TableRow>
                    <TableCell align="center">
                        {translate('resources.list.expandable.version')}
                    </TableCell>
                    <TableCell align="center">
                        {translate('resources.list.expandable.created')}
                    </TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {versions.map(item => (
                    <TableRow key={item.id}>
                        <TableCell component="th" scope="row" align="center">
                            {item.metadata?.version}
                        </TableCell>
                        <TableCell align="center">
                            <DateField
                                source="created"
                                record={item.metadata}
                            />
                        </TableCell>
                        <TableCell size="small" align="right">
                            <ShowButton record={item} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </MaterialTable>
    );
};

export const ArtifactList = () => {
    const translate = useTranslate();
    const schemaProvider = useSchemaProvider();
    const [kinds, setKinds] = useState<any[]>();

    useEffect(() => {
        if (schemaProvider) {
            schemaProvider.kinds('dataitems').then(res => {
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
        <Container maxWidth={false}>
            <ListBase exporter={yamlExporter}>
                <>
                    <ListPageTitle icon={<ArtifactIcon fontSize={'large'} />} />
                    <ListView filters={postFilters}>
                        <Datagrid rowClick="show" expand={ListVersion}>
                            <TextField source="name" />
                            <TextField source="kind" />
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'end',
                                }}
                            >
                                <ShowButton />
                                <EditButton />
                                <DeleteWithConfirmButtonShowingName />
                            </div>
                        </Datagrid>
                    </ListView>
                </>
            </ListBase>
        </Container>
    );
};
