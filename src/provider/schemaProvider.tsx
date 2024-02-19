import {
    ReactElement,
    createContext,
    useContext,
    useMemo,
    useState,
} from 'react';
import PropTypes from 'prop-types';
import {
    DataProvider,
    GetListResult,
    GetOneResult,
    SortPayload,
    useResourceDefinitions,
} from 'react-admin';

//TODO fix backend API to properly define ENUM as TYPE(value)
function mapType(resource) {
    if (resource === 'functions') {
        return 'FUNCTION';
    }
    if (resource === 'artifacts') {
        return 'ARTIFACT';
    }
    if (resource === 'dataitems') {
        return 'DATAITEM';
    }

    return null;
}

const schemaProvider = (
    dataProvider: DataProvider,
    prefix: string
): SchemaProvider => {
    return {
        list: resource => {
            const params = {
                pagination: { page: 0, perPage: 100 },
                sort: { field: 'id', order: 'ASC' } as SortPayload,
                filter: null,
            };
            const type = mapType(resource);
            if (!type) {
                return Promise.reject(new Error('invalid type ' + resource));
            }
            const key = prefix ? prefix + '/' + type : type;
            return dataProvider.getList(key, params);
        },

        get: (resource, kind) => {
            const params = { id: kind };
            const type = mapType(resource);
            if (!type) {
                return Promise.reject(new Error('invalid type ' + resource));
            }
            const key = prefix ? prefix + '/' + type : type;
            return dataProvider.getOne(key, params);
        },
    };
};

export type SchemaProvider<ResourceType extends string = string> = {
    list: (resource: ResourceType) => Promise<GetListResult<any>>;

    get: (resource: ResourceType, kind: string) => Promise<GetOneResult<any>>;
};

interface SchemaProviderContextValue {
    provider: SchemaProvider | undefined;
    schemas: any | null;
    kinds: (resource: string) => Promise<string[] | null>;
    list: (resource: string) => Promise<any[] | null>;
    get: (resource: string, kind: string) => Promise<any>;
}

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

export const ResourceSchemaProvider = (props: ResourceSchemaProviderParams) => {
    const { resource, dataProvider, children } = props;
    const [cache, setCache] = useState<any>({});
    const definitions = useResourceDefinitions();
    const finalProvider = useMemo(() => {
        return schemaProvider(dataProvider, resource);
    }, [resource, dataProvider]);

    const schemaContext = useMemo(() => {
        //local cache lookup
        //NOTE: need to explode because update via setCache is async
        //NOTE: exploding in memoization because we can't keep schemaProvider memoized
        //TODO cleanup
        let _cache = { ...cache };

        const list = async (resource: string): Promise<any[] | null> => {
            if (!(resource in definitions)) {
                return null;
            }

            if (!(resource in _cache)) {
                const res = await finalProvider.list(resource);
                if (res.data) {
                    _cache[resource] = res;
                    setCache(_cache);
                }
            }

            return _cache[resource].data as any[];
        };

        const get = async (
            resource: string,
            id: string
        ): Promise<any | null> => {
            if (!(resource in definitions)) {
                return null;
            }

            if (!(resource in _cache)) {
                _cache = await list(resource);
            }

            return _cache[resource].data.find(r => r.id === id);
        };

        const kinds = async (resource: string): Promise<string[] | null> => {
            if (!(resource in definitions)) {
                return null;
            }
            const schemas = await list(resource);
            if (schemas == null) {
                return null;
            }

            return schemas.map(s => s.kind);
        };
        return {
            provider: finalProvider,
            schemas: cache,
            list,
            get,
            kinds,
        };
    }, [finalProvider, definitions, setCache]);

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
