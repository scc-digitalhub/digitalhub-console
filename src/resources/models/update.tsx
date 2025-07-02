// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { JsonSchemaInput } from '../../components/JsonSchema';
import {
    useTranslate,
    SimpleForm,
    TextInput,
    SelectInput,
    Create,
    LoadingIndicator,
    useDataProvider,
} from 'react-admin';
import { useParams } from 'react-router-dom';
import { MetadataSchema } from '../../common/schemas';
import { ModelTypes } from './types';
import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { RecordTitle } from '../../components/RecordTitle';
import { EditToolbar } from '../../components/toolbars/EditToolbar';

const kinds = Object.values(ModelTypes).map(v => {
    return {
        id: v,
        name: v,
    };
});

export const ModelUpdate = () => {
    const { id } = useParams();
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const [record, setRecord] = useState<Object>();

    useEffect(() => {
        if (dataProvider && id) {
            dataProvider.getOne('Models', { id }).then(data => {
                const obj = Object.assign({}, data.data) as Object;
                delete obj['id'];
                setRecord(obj);
            });
        }
    }, [dataProvider, id]);
    if (!record) {
        return <LoadingIndicator />;
    }

    return (
        <Create
            title={<RecordTitle prompt={translate('ModelString')} />}
            redirect="list"
        >
            <ModelEditForm record={record} />
        </Create>
    );
};

const ModelEditForm = (props: { record: any }) => {
    const { record } = props;

    return (
        <SimpleForm defaultValues={record} toolbar={<EditToolbar />}>
            <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid size={4}>
                    <TextInput
                        source="name"
                        label="resources.functions.name"
                        disabled
                    />
                </Grid>
                <Grid size={6}>
                    <SelectInput
                        source="kind"
                        label="resources.functions.kind"
                        choices={kinds}
                        disabled
                    />
                </Grid>
            </Grid>

            <JsonSchemaInput source="metadata" schema={MetadataSchema} />
        </SimpleForm>
    );
};
