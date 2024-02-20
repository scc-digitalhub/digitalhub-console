import {
    Datagrid,
    EditButton,
    List,
    ListBase,
    ListView,
    SelectInput,
    ShowButton,
    TextField,
    TextInput,
    useTranslate,
} from 'react-admin';
import yamlExporter from '@dslab/ra-export-yaml';
import {
    DeleteWithConfirmButtonShowingName,
    ListVersion,
} from '../../components/helper';
import { DataItemTypes } from './types';
import { ListPageTitle } from '../../components/pageTitle';
import { DataItemIcon } from '../../components/icons';
import { VersionsList } from '../../components/versionsList';
import { Container } from '@mui/material';

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
