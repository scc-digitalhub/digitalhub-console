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

const kinds = Object.values(DataItemTypes).map(v => {
    return {
        id: v,
        name: v,
    };
});
export const DataItemList = () => {
    const translate = useTranslate();
    const postFilters = [
        <TextInput
            label={translate('search.name')}
            source="name"
            alwaysOn
            key={1}
        />,
        <SelectInput alwaysOn key={2} source="kind" choices={kinds} />,
    ];

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
