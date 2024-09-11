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
}) => {
    const {
        source,
        onDirty,
        getUiSchema,
        schema: schemaProp,
        kind: kindProp,
    } = props;
    const translate = useTranslate();
    const resource = useResourceContext();
    const record = useRecordContext();
    const value = useWatch({ name: source });
    const eq = deepEqual(record[source], value);

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

    return (
        <JsonSchemaInput
            source={source}
            schema={{ ...schema, title: 'Spec' }}
            uiSchema={getUiSchema(record.kind)}
        />
    );
};
