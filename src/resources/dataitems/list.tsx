import yamlExporter from '@dslab/ra-export-yaml';
import { Container } from '@mui/material';
import {
    Datagrid,
    EditButton,
    ListBase,
    ListView,
    SelectInput,
    ShowButton,
    TextField,
    TextInput,
    useTranslate,
} from 'react-admin';
import { DeleteWithConfirmButtonShowingName } from '../../components/helper';
import { ListPageTitle } from '../../components/pageTitle';
import { VersionsList } from '../../components/versionsList';
import { DataItemIcon } from './icon';
import { DataItemTypes } from './types';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { useState, useEffect } from 'react';

export const DataItemList = () => {
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
                    <ListPageTitle icon={<DataItemIcon fontSize={'large'} />} />
                    <ListView filters={postFilters}>
                        <Datagrid
                            rowClick="show"
                            expand={<VersionsList />}
                            expandSingle={true}
                        >
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
