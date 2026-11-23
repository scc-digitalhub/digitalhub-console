import { useEffect, useState } from 'react';
import { useRecordContext } from 'react-admin';
import { useWatch } from 'react-hook-form';
import { SpecInput } from '../../common/jsonSchema/components/SpecInput';
import { StorePathInput } from '../../common/components/StorePathInput';
import { SearchFilter } from '../../features/search/SearchProvider';
import { useFunctionSpecSchema } from './useFunctionSpecSchema';

const modelFilters: Record<string, SearchFilter[]> = {
    ollamaserve: [{ filter: 'type:model' }, { filter: 'kind:(ollama OR huggingface)' }],
    huggingfaceserve: [{ filter: 'type:model' }, { filter: 'kind:huggingface' }],
    mlflowserve: [{ filter: 'type:model' }, { filter: 'kind:mlflow' }],
    sklearnserve: [{ filter: 'type:model' }, { filter: 'kind:sklearn' }],
};

export const FunctionSpecFields = ({ kind, onDirty }: {
    kind?: string;
    onDirty: (dirty: boolean) => void;
}) => {
    const record = useRecordContext();
    const { schema, uiSchema, pathSchema, pathValidators } = useFunctionSpecSchema(kind);
    const path = useWatch({ name: 'path' });
    const [specDirty, setSpecDirty] = useState(false);
    const pathDirty = Boolean(pathSchema) &&
        (path ?? record?.spec?.path ?? null) !== (record?.spec?.path ?? null);

    useEffect(() => {
        onDirty(specDirty || pathDirty);
    }, [specDirty, pathDirty, onDirty]);

    return (
        <>
            {schema && (
                <SpecInput
                    key={kind}
                    source="spec"
                    kind={kind}
                    schema={schema}
                    uiSchema={uiSchema}
                    onDirty={setSpecDirty}
                />
            )}
            {pathSchema && (
                <StorePathInput
                    key={kind}
                    source="path"
                    label={pathSchema.title ?? 'fields.path.title'}
                    helperText={pathSchema.description}
                    defaultValue={record?.spec?.path}
                    filters={kind ? modelFilters[kind] : undefined}
                    validate={pathValidators}
                />
            )}
        </>
    );
};