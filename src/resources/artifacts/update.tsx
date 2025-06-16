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
import { ArtifactTypes } from './types';
import { useEffect, useState } from 'react';
import { RecordTitle } from '../../components/RecordTitle';
import { EditToolbar } from '../../components/toolbars/EditToolbar';

const kinds = Object.values(ArtifactTypes).map(v => {
    return {
        id: v,
        name: v,
    };
});

export const ArtifactUpdate = () => {
    const { id } = useParams();
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const [record, setRecord] = useState<Object>();

    useEffect(() => {
        if (dataProvider && id) {
            dataProvider.getOne('artifacts', { id }).then(data => {
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
            title={<RecordTitle prompt={translate('artifactString')} />}
            redirect="list"
        >
            <ArtifactEditForm record={record} />
        </Create>
    );
};

const ArtifactEditForm = (props: { record: any }) => {
    const { record } = props;
    return (
        <SimpleForm defaultValues={record} toolbar={<EditToolbar />}>
            <TextInput source="name" disabled />
            <SelectInput source="kind" choices={kinds} disabled />
            <JsonSchemaInput source="metadata" schema={MetadataSchema} />
        </SimpleForm>
    );
};
