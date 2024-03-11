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

import { SecretIcon } from './icon';
import { useState, useEffect } from 'react';
import { DeleteWithConfirmButtonShowingName } from '../../components/DeleteWithConfirmButtonShowingName';
import { ListPageTitle } from '../../components/PageTitle';

export const SecretList = () => {
    const translate = useTranslate();
    const [kinds, setKinds] = useState<any[]>();

    const postFilters = kinds
        ? [
              <TextInput
                  label={translate('search.name')}
                  source="name"
                  alwaysOn
                  key={1}
              />,
          ]
        : [];
    return (
        <Container maxWidth={false}>
            <ListBase exporter={yamlExporter}>
                <>
                    <ListPageTitle icon={<SecretIcon fontSize={'large'} />} />
                    <ListView filters={postFilters}>
                        <Datagrid rowClick="show">
                            <TextField source="name" label="Name" />
                            <TextField source="spec.path" label="Path" />
                            <TextField
                                source="spec.provider"
                                label="Provider"
                            />
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
