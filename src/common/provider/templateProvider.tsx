// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    ReactElement,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { GetListParams, ResourceContextValue } from 'react-admin';
import PropTypes from 'prop-types';
import {
    DataProvider,
    GetListResult,
    GetOneResult,
    SortPayload,
    useResourceDefinitions,
} from 'react-admin';

const templateProvider = (dataProvider: DataProvider): TemplateProvider => {
    return {
        list: (resource: string, params?: GetListParams) => {
            const finalParams = params ?? {
                pagination: { page: 0, perPage: 100 },
                sort: { field: 'id', order: 'ASC' } as SortPayload,
            };
            const key = resource + '/templates';
            return dataProvider.getList(key, finalParams);
        },

        get: (resource, id) => {
            const params = { id: id };
            const key = resource + '/templates';
            return dataProvider.getOne(key, params);
        },
    };
};

export type TemplateProvider = {
    list: (
        resource: string,
        params?: GetListParams
    ) => Promise<GetListResult<any>>;
    get: (resource: string, id: string) => Promise<GetOneResult<any>>;
};

interface TemplateProviderContextValue {
    provider: TemplateProvider | undefined;
    list: (
        resource: ResourceContextValue | string,
        params?: GetListParams
    ) => Promise<any[]>;
    get: (resource: ResourceContextValue | string, id: string) => Promise<any>;
}

export const TemplateProviderContext = createContext<
    TemplateProviderContextValue | undefined
>(undefined);

export const useTemplateProvider = () => {
    const value = useContext(TemplateProviderContext);
    if (value === undefined) {
        throw new Error('useTemplateProvider must be inside a provider');
    }
    return value;
};

export const ResourceTemplateProvider = (
    props: ResourceTemplateProviderParams
) => {
    const { dataProvider, children } = props;
    const definitions = useResourceDefinitions();
    const finalProvider = useMemo(() => {
        return templateProvider(dataProvider);
    }, [dataProvider]);

    const context = useMemo(() => {
        const list = async (
            resource: ResourceContextValue | string,
            params?: GetListParams
        ): Promise<any[]> => {
            if (!resource || !(resource in definitions)) {
                return [];
            }

            const res = await finalProvider.list(resource, params);
            if (!res?.data) {
                return [];
            }

            // deep copy via stringify because we risk users altering the spec
            return res.data.map(a => JSON.parse(JSON.stringify(a)));
        };

        const get = async (
            resource: ResourceContextValue | string,
            id: string
        ): Promise<any | null> => {
            if (!resource || !(resource in definitions)) {
                return null;
            }

            const l = await finalProvider.get(resource, id);
            if (!l) {
                return null;
            }

            // deep copy via stringify because we risk users altering the spec
            return JSON.parse(JSON.stringify(l));
        };

        return {
            provider: finalProvider,
            list,
            get,
        };
    }, [finalProvider, definitions]);

    return (
        <TemplateProviderContext.Provider value={context}>
            {children}
        </TemplateProviderContext.Provider>
    );
};

export type ResourceTemplateProviderParams = {
    /**
     * data provider
     */
    dataProvider: DataProvider;

    /**
     * React-Admin (like) child
     */
    children: ReactElement;
};

ResourceTemplateProvider.propTypes = { children: PropTypes.element.isRequired };

/**
 * Returns templates and whether the current request is still loading.
 */
export const useGetTemplates = (
    resource: ResourceContextValue | string,
    params?: GetListParams
): { data: any[] | undefined; isLoading: boolean } => {
    const { list } = useTemplateProvider();
    const [templates, setTemplates] = useState<any[]>();
    const paramsKey = JSON.stringify(params);

    useEffect(() => {
        let active = true;
        setTemplates(undefined);

        list(resource, paramsKey ? JSON.parse(paramsKey) : undefined)
            .then(result => {
                if (active) {
                    setTemplates(result);
                }
            })
            .catch(() => {
                if (active) {
                    setTemplates([]);
                }
            });

        return () => {
            active = false;
        };
    }, [list, paramsKey, resource]);

    return { data: templates, isLoading: templates === undefined };
};

export default templateProvider;
