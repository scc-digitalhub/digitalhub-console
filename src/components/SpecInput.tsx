import { Card, CardContent } from '@mui/material';
import deepEqual from 'deep-is';
import { useEffect, useState } from 'react';
import {
    InputProps,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { useWatch } from 'react-hook-form';
import { useSchemaProvider } from '../provider/schemaProvider';
import { JsonSchemaInput } from './JsonSchema';

export const SpecInput = (props: InputProps & {
    source: string;
    onDirty?: (state: boolean) => void;
    getUiSchema: (kind: string) => any;
    schema?: any;
    kind?: string;
    kindSource?: string;
}) => {
    const {
        source,
        onDirty,
        getUiSchema,
        schema: schemaProp,
        kind: kindProp,
        kindSource = 'kind',
    } = props;
    const translate = useTranslate();
    const resource = useResourceContext();
    const record = useRecordContext();
    const value = useWatch({ name: source });
    const kindValue = useWatch({ name: kindSource });

    const schemaProvider = useSchemaProvider();
    const [schema, setSchema] = useState<any>();
    const kind = kindProp || kindValue || (record ? record[kindSource] : null);

    useEffect(() => {
        if (!kind) {
            return;
        }
        if (schemaProp) {
            setSchema(schemaProp);
        } else if (schemaProvider) {
            schemaProvider.get(resource, kind).then(s => setSchema(s.schema));
        }
    }, [kind, schemaProvider, schemaProp]);

    useEffect(() => {
        if (onDirty && record) {
            onDirty(!deepEqual(record[source], value));
        }
    }, [record, value]);

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

    return (
        <JsonSchemaInput
            source={source}
            schema={{ ...schema, title: 'Spec' }}
            uiSchema={getUiSchema(kind)}
        />
    );
};
