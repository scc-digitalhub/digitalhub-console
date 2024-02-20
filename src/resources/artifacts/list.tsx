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
import {
    DeleteWithConfirmButtonShowingName,
    ListVersion,
} from '../../components/helper';
import { ListPageTitle } from '../../components/pageTitle';
import { ArtifactIcon } from './icon';
import { ArtifactTypes } from './types';

const kinds = Object.values(ArtifactTypes).map(v => {
    return {
        id: v,
        name: v,
    };
});
export const ArtifactList = () => {
    const translate = useTranslate();
    const postFilters = [
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
    ];
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
