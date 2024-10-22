import { Card, CardContent } from '@mui/material';
import deepEqual from 'deep-is';
import { useEffect, useState } from 'react';
import {
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { useWatch } from 'react-hook-form';
import { useSchemaProvider } from '../provider/schemaProvider';
import { JsonSchemaInput } from './JsonSchema';

export const SpecInput = (props: {
    source: string;
    onDirty?: (state: boolean) => void;
    getUiSchema: (kind: string) => any;
    schema?: any;
    kind?: string;
    label?: string;
    helperText?: string;
}) => {
    const {
        source,
        onDirty,
        getUiSchema,
        schema: schemaProp,
        kind: kindProp,
        label = 'fields.spec.title',
        helperText,
    } = props;
    const translate = useTranslate();
    const resource = useResourceContext();
    const record = useRecordContext();
    const value = useWatch({ name: source });
    const eq = record?.source ? deepEqual(record[source], value) : false;

    const schemaProvider = useSchemaProvider();
    const [schema, setSchema] = useState<any>();
    const kind = kindProp || record?.kind || null;

    useEffect(() => {
        if (!kind) {
            return;
        }
        if (schemaProp) {
            setSchema(schemaProp);
        } else if (schemaProvider && record) {
            schemaProvider.get(resource, kind).then(s => setSchema(s.schema));
        }
    }, [record, schemaProvider, schemaProp]);

    useEffect(() => {
        if (onDirty) {
            onDirty(!eq);
        }
    }, [eq]);

    if (!kind || !schema) {
        return (
            <Card
                sx={{
                    width: 1,
                    textAlign: 'center',
                }}
            >
                <CardContent>
                    {translate('resources.common.emptySpec')}{' '}
                </CardContent>
            </Card>
        );
    }

    const jsonSchema = { ...schema, title: label };
    if (helperText !== undefined) {
        jsonSchema['description'] = helperText;
    }

    return (
        <JsonSchemaInput
            source={source}
            schema={jsonSchema}
            uiSchema={getUiSchema(kind)}
        />
    );
};
