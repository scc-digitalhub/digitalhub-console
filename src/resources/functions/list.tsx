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
    useTranslate,
} from 'react-admin';
import yamlExporter from '@dslab/ra-export-yaml';
import { DeleteWithConfirmButtonShowingName } from '../../components/helper';
import { ListPageTitle } from '../../components/pageTitle';
import { FunctionIcon } from './icon';
import { VersionsList } from '../../components/versionsList';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { useEffect, useState } from 'react';
import { RowButtonGroup } from '../../components/RowButtonGroup';

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
        <ListBase exporter={yamlExporter}>
            <>
                <ListPageTitle icon={<FunctionIcon fontSize={'large'} />} />
                <ListView filters={postFilters}>
                    <Datagrid
                        rowClick="show"
                        expand={<VersionsList />}
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
    );
};
