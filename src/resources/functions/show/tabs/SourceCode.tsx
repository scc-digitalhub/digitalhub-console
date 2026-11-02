import { RecordContextProvider, useRecordContext } from 'react-admin';
import { useGetSchema } from '../../../../common/jsonSchema/schemaController';
import { filterProperties } from '../../../../common/jsonSchema/utils';
import { getFunctionUiSpec } from '../../types';
import { JsonSchemaField } from '../../../../common/jsonSchema/components/JsonSchema';

export const SourceCode = (props: { fields?: string[] }) => {
    const { fields = ['source'] } = props;
    const record = useRecordContext();
    const { data: schema } = useGetSchema();

    //build custom record
    const r = record
        ? {
              spec: Object.fromEntries(
                  Object.entries(record.spec || {}).filter(([key]) =>
                      fields.includes(key)
                  )
              ),
          }
        : {};

    if (!record || !schema) return <> </>;

    return (
        <RecordContextProvider value={r}>
            <JsonSchemaField
                source="spec"
                schema={{
                    ...filterProperties(schema?.schema, fields),
                    title: '',
                }}
                uiSchema={getFunctionUiSpec(record.kind)}
                label={false}
            />
        </RecordContextProvider>
    );
};
