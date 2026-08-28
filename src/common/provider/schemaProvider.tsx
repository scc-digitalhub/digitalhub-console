// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    ReactElement,
    createContext,
    useContext,
    useMemo,
    useRef,
} from 'react';
import PropTypes from 'prop-types';
import {
    DataProvider,
    GetListResult,
    GetOneResult,
    SortPayload,
    useResourceDefinitions,
} from 'react-admin';
import { RJSFSchema, UiSchema } from '@rjsf/utils';
//TODO fix backend API to properly define ENUM as TYPE(value)
export const mapType = (resource: string) => {
    //remove s + capitalize
    //ex functions => FUNCTION
    return resource.slice(0, -1);
};

const schemaProvider = (
    dataProvider: DataProvider,
    prefix: string
): SchemaProvider => {
    return {
        list: (resource, runtime) => {
            const params = {
                pagination: { page: 0, perPage: 100 },
                sort: { field: 'id', order: 'ASC' } as SortPayload,
                filter: runtime ? { runtime: runtime } : null,
            };
            const type = mapType(resource);
            if (!type) {
                return Promise.reject(new Error('invalid type ' + resource));
            }
            const key = prefix ? prefix + '/' + type : type;
            return dataProvider.getList(key, params).then(res => {
                if (res.data) {
                    res.data.forEach(schema => preprocessSchema(schema));
                }
                return res;
            });
        },

        get: (resource, kind) => {
            const params = { id: kind };
            const type = mapType(resource);
            if (!type) {
                return Promise.reject(new Error('invalid type ' + resource));
            }
            const key = prefix ? prefix + '/' + type : type;
            return dataProvider.getOne(key, params).then(res => {
                if (res.data) {
                    preprocessSchema(res.data);
                }
                return res;
            });
        },
    };
};

export type SchemaProvider<ResourceType extends string = string> = {
    list: (
        resource: ResourceType,
        runtime?: string
    ) => Promise<GetListResult<any>>;

    get: (resource: ResourceType, kind: string) => Promise<GetOneResult<any>>;
};

interface SchemaProviderContextValue {
    provider: SchemaProvider | undefined;
    schemas: any | null;
    kinds: (resource: string) => Promise<string[] | null>;
    list: (resource: string, runtime?: string) => Promise<any[]>;
    get: (resource: string, kind: string) => Promise<any>;
}

export type Schema = {
    kind: string;
    entity: string;
    schema: RJSFSchema | object | string;
    uiSchema?: UiSchema | object | string;
    id?: string;
    runtime?: string;
};

export const SchemaProviderContext = createContext<
    SchemaProviderContextValue | undefined
>(undefined);

export const useSchemaProvider = () => {
    const value = useContext(SchemaProviderContext);
    if (value === undefined) {
        throw new Error('useSchemaProvider must be inside a provider');
    }
    return value;
};

/**
 * Workaround: convert serializable inputs to pure String input.
 * TODO: custom widget with input field and type selection?
 * @param schema
 */
const preprocessSchema = schema => {
    if (false) {
        // if (schema && schema.schema) {
        if (schema.schema['properties']) {
            const props = schema.schema['properties'];
            if (!schema.schema['$defs']) {
                schema.schema['$defs'] = {};
            }
            if (
                schema.schema['$defs']['Map_String.Serializable_'] &&
                !schema.schema['$defs']['Map_String.String_']
            ) {
                schema.schema['$defs']['Map_String.String_'] = {
                    type: 'object',
                    additionalProperties: { type: 'string' },
                };
            }
            if (
                schema.schema['$defs']['Entry_String.Serializable_'] &&
                !schema.schema['$defs']['Entry_String.String_']
            ) {
                schema.schema['$defs']['Entry_String.String_'] = {
                    type: 'object',
                    additionalProperties: { type: 'string' },
                };
            }
            Object.keys(props).forEach(k => {
                if (props[k]['$ref'] === '#/$defs/Map_String.Serializable_') {
                    props[k]['$ref'] = '#/$defs/Map_String.String_';
                    props[k]['additionalProperties']['type'] = 'string';
                    delete props[k]['additionalProperties']['$ref'];
                }
                if (props[k]['$ref'] === '#/$defs/Entry_String.Serializable_') {
                    props[k]['$ref'] = '#/$defs/Entry_String.String_';
                    props[k]['additionalProperties']['type'] = 'string';
                    delete props[k]['additionalProperties']['$ref'];
                }
            });
        }
        if (schema.schema['$defs']) {
            const defs = schema.schema['$defs'];
            if (defs['Serializable']) {
                defs['Serializable'].additionalProperties = { type: 'string' };
            }
        }
    }
};

export const ResourceSchemaProvider = (props: ResourceSchemaProviderParams) => {
    const { resource, dataProvider, children } = props;
    const cache = useRef({});
    const definitions = useResourceDefinitions();
    const finalProvider = useMemo(() => {
        return schemaProvider(dataProvider, resource);
    }, [resource, dataProvider]);

    const schemaContext = useMemo(() => {
        //local cache lookup
        //NOTE: exploding in memoization because we can't keep schemaProvider memoized
        //TODO cleanup
        let _cache = cache.current;

        const list = async (
            resource: string,
            runtime?: string
        ): Promise<any[]> => {
            const k = '_' + (runtime ? resource + '.' + runtime : resource);
            if (!(resource in definitions)) {
                return [];
            }

            if (!(k in _cache)) {
                const res = await finalProvider.list(resource, runtime);
                if (res.data) {
                    _cache[k] = [...res.data];
                }
            }
            // deep copy via stringify because we risk users altering the spec
            return _cache[k].map(a => JSON.parse(JSON.stringify(a)));
        };

        const get = async (
            resource: string,
            kind: string
        ): Promise<any | null> => {
            if (!(resource in definitions)) {
                return null;
            }

            if (!(resource in _cache)) {
                return list(resource).then(l => {
                    if (!l) {
                        return null;
                    }

                    return l.find(r => r.kind === kind);
                });
            }

            const hit = (_cache[resource] || []).find(r => r.kind === kind);
            // deep copy via stringify because we risk users altering the spec
            return JSON.parse(JSON.stringify(hit));
        };

        const kinds = async (resource: string): Promise<string[]> => {
            if (!(resource in definitions)) {
                return [];
            }
            const schemas = await list(resource);
            if (schemas == null) {
                return [];
            }

            return [...schemas.map(s => s.kind)];
        };
        return {
            provider: finalProvider,
            schemas: cache,
            list,
            get,
            kinds,
        };
    }, [finalProvider, definitions]);

    return (
        <SchemaProviderContext.Provider value={schemaContext}>
            {children}
        </SchemaProviderContext.Provider>
    );
};

export type ResourceSchemaProviderParams = {
    /**
     * resource identifier to define the resource used for schemas.
     * Used as prefix in API callss
     */
    resource: string;
    /**
     * data provider
     */
    dataProvider: DataProvider;

    /**
     * React-Admin (like) child
     */
    children: ReactElement;
};

ResourceSchemaProvider.propTypes = { children: PropTypes.element.isRequired };

export default schemaProvider;
