import { useEffect, useMemo, useRef, useState } from 'react';
import { useSchemaProvider } from '../provider/schemaProvider';

export const useGetSchemas = (
    resource: string,
    runtime?: string
): { data?: any[]; isLoading?: boolean; error?: any } => {
    const schemaProvider = useSchemaProvider();
    const [schemas, setSchemas] = useState<any[]>();

    const isLoading = useRef(true);
    const error = useRef<any>(null);

    useEffect(() => {
        if (schemaProvider) {
            isLoading.current = true;
            schemaProvider
                .list(resource, runtime)
                .then(res => {
                    setSchemas(res || []);
                    isLoading.current = false;
                })
                .catch(e => (error.current = e));
        }
    }, [resource, runtime]);

    return {
        data: schemas,
        isLoading: isLoading.current,
        error: error.current,
    };
};

export const useGetSchema = (
    resource: string,
    kind: string
): { data?: any; isLoading?: boolean; error?: any } => {
    const schemaProvider = useSchemaProvider();
    const [schema, setSchema] = useState<any>();

    const isLoading = useRef(true);
    const error = useRef<any>(null);

    useEffect(() => {
        if (schemaProvider) {
            isLoading.current = true;
            schemaProvider
                .get(resource, kind)
                .then(res => {
                    setSchema(res || null);
                    isLoading.current = false;
                })
                .catch(e => (error.current = e));
        }
    }, [resource, kind]);

    return useMemo(
        () => ({
            data: schema,
            isLoading: isLoading.current,
            error: error.current,
        }),
        [schema]
    );
};

export const useGetManySchemas = (
    kinds: GetManySchemaParams[]
): {
    data?: any[];
    isLoading?: boolean;
    error?: any;
} => {
    const schemaProvider = useSchemaProvider();

    const [schemas, setSchemas] = useState<any[]>();
    const isLoading = useRef(true);
    const error = useRef<any>(null);
    useEffect(() => {
        if (schemaProvider) {
            isLoading.current = true;
            Promise.all(
                kinds.map(k => schemaProvider.list(k.resource, k.runtime))
            )
                .then(lists => {
                    setSchemas(lists ? lists.flat() : []);
                    isLoading.current = false;
                })
                .catch(e => (error.current = e));
        }
    }, [JSON.stringify(kinds)]);

    return {
        data: schemas,
        isLoading: isLoading.current,
        error: error.current,
    };
};

export type GetManySchemaParams = {
    resource: string;
    runtime?: string;
};
