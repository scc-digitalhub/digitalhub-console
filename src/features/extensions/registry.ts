// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    ComponentType,
    createContext,
    createElement,
    ReactElement,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState,
} from 'react';
import {
    ConsoleViewContribution,
    ConsoleViewName,
    ConsoleViewShowIn,
} from './ConsoleExtension';
import { consoleExtensionRegistry } from './ConsoleExtensionRegistry';
import { useLocation } from 'react-router-dom';
import {
    CreateContext,
    EditContext,
    ListContext,
    ShowContext,
    useResourceContext,
} from 'react-admin';

interface ConsoleExtensionRegistryContextValue {
    ready: boolean;
    loading: boolean;
    error: unknown;
    loadModule: (id: string) => Promise<void>;
    loadModules: (ids: string[]) => Promise<void>;
    loadAllModules: () => Promise<void>;
    getComponent: (componentKey: string) => ComponentType<any> | undefined;
    getViewContributions: (
        resource: string,
        view: ConsoleViewName,
        showIn: ConsoleViewShowIn
    ) => ConsoleViewContribution[];
    getJsonSchemaWidgets: () => Record<string, ComponentType<any>>;
    getJsonSchemaTemplates: () => Record<string, ComponentType<any>>;
    getJsonSchemaFields: () => Record<string, ComponentType<any>>;
}

export interface UseViewContributionsOptions {
    showIn: ConsoleViewShowIn;
    resource?: string;
    view?: ConsoleViewName;
}

export interface ConsoleExtensionRegistryProviderProps {
    children: ReactNode;
    preloadModuleIds?: string[];
}

export const ConsoleExtensionRegistryContext =
    createContext<ConsoleExtensionRegistryContextValue | undefined>(undefined);

export const ConsoleExtensionRegistryProvider = (
    props: ConsoleExtensionRegistryProviderProps
) => {
    const { children, preloadModuleIds = [] } = props;
    const loadedModulesRef = useRef(new Set<string>());

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);
    const [ready, setReady] = useState(preloadModuleIds.length === 0);
    const [, forceRefresh] = useReducer((value: number) => value + 1, 0);

    const loadModule = useCallback(async (id: string) => {
        if (loadedModulesRef.current.has(id)) {
            return;
        }

        await consoleExtensionRegistry.loadModule(id);
        loadedModulesRef.current.add(id);

        // Trigger a rerender so consumers can read newly registered extensions.
        forceRefresh();
    }, []);

    const loadModules = useCallback(
        async (ids: string[]) => {
            if (!ids.length) {
                return;
            }

            await Promise.all(ids.map((id) => loadModule(id)));
        },
        [loadModule]
    );

    const getComponent = useCallback((componentKey: string) => {
        return consoleExtensionRegistry.getComponent(componentKey);
    }, []);

    const getViewContributions = useCallback(
        (resource: string, view: ConsoleViewName, showIn: ConsoleViewShowIn) => {
            return consoleExtensionRegistry.getViewContributions(
                resource,
                view,
                showIn
            );
        },
        []
    );

    const getJsonSchemaWidgets = useCallback(() => {
        return consoleExtensionRegistry.getJsonSchemaWidgets();
    }, []);

    const getJsonSchemaTemplates = useCallback(() => {
        return consoleExtensionRegistry.getJsonSchemaTemplates();
    }, []);

    const getJsonSchemaFields = useCallback(() => {
        return consoleExtensionRegistry.getJsonSchemaFields();
    }, []);

    const loadAllModules = useCallback(async () => {
        const moduleIds = Array.from(consoleExtensionRegistry.getModuleIds());

        if (!moduleIds.length) {
            return;
        }

        await loadModules(moduleIds);
    }, [loadModules]);

    useEffect(() => {
        let active = true;

        if (!preloadModuleIds.length) {
            setReady(true);
            return;
        }

        setLoading(true);
        setError(null);

        loadModules(preloadModuleIds)
            .then(() => {
                if (!active) {
                    return;
                }
                setReady(true);
            })
            .catch((e) => {
                if (!active) {
                    return;
                }
                setError(e);
            })
            .finally(() => {
                if (!active) {
                    return;
                }
                setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [loadModules, preloadModuleIds]);

    const value = {
        ready,
        loading,
        error,
        loadModule,
        loadModules,
        loadAllModules,
        getComponent,
        getViewContributions,
        getJsonSchemaWidgets,
        getJsonSchemaTemplates,
        getJsonSchemaFields,
    };

    return createElement(
        ConsoleExtensionRegistryContext.Provider,
        { value },
        children
    );
};

export const useConsoleExtensionRegistry = () => {
    const value = useContext(ConsoleExtensionRegistryContext);

    if (value === undefined) {
        throw new Error(
            'useConsoleExtensionRegistry must be used inside a ConsoleExtensionRegistryProvider'
        );
    }

    return value;
};

export const useConsoleExtension = (id: string) => {
    const { getComponent } = useConsoleExtensionRegistry();
    return getComponent(id);
};

const useDetectedView = () => {
    const createContext = useContext(CreateContext);
    const editContext = useContext(EditContext);
    const showContext = useContext(ShowContext);
    const listContext = useContext(ListContext);

    if (editContext) {
        return 'edit' as const;
    }

    if (createContext) {
        return 'create' as const;
    }

    if (showContext) {
        return 'show' as const;
    }

    if (listContext) {
        return 'list' as const;
    }

    return undefined;
};

const detectViewFromPathname = (pathname: string) => {
    if (pathname.endsWith('/edit')) {
        return 'edit' as const;
    }

    if (pathname.endsWith('/create')) {
        return 'create' as const;
    }

    if (pathname.endsWith('/show')) {
        return 'show' as const;
    }

    return 'list' as const;
};

export const useViewContributions = (
    options: UseViewContributionsOptions
): ReactElement[] => {
    const { loadAllModules, getComponent, getViewContributions } =
        useConsoleExtensionRegistry();
    const resourceFromContext = useResourceContext({
        resource: options.resource,
    });
    const detectedView = useDetectedView();
    const location = useLocation();

    const resource = options.resource || resourceFromContext;
    const view =
        options.view ||
        detectedView ||
        detectViewFromPathname(location.pathname);

    useEffect(() => {
        loadAllModules().catch((error) => {
            console.error('Unable to load console extension modules', error);
        });
    }, [loadAllModules]);

    return useMemo(() => {
        if (!resource || !view) {
            return [];
        }

        return getViewContributions(resource, view, options.showIn)
            .map((contribution) => {
                const ExtensionComponent = getComponent(
                    contribution.componentKey
                );

                if (!ExtensionComponent) {
                    return null;
                }

                return createElement(ExtensionComponent, {
                    key: contribution.id,
                });
            })
            .filter(
                (element): element is ReactElement => element !== null
            );
    }, [resource, view, options.showIn, getViewContributions, getComponent]);
};

export const useJsonSchemaContributions = () => {
    const {
        loadAllModules,
        getJsonSchemaWidgets,
        getJsonSchemaTemplates,
        getJsonSchemaFields,
    } = useConsoleExtensionRegistry();

    useEffect(() => {
        loadAllModules().catch((error) => {
            console.error('Unable to load console extension modules', error);
        });
    }, [loadAllModules]);

    return useMemo(
        () => ({
            widgets: getJsonSchemaWidgets(),
            templates: getJsonSchemaTemplates(),
            fields: getJsonSchemaFields(),
        }),
        [getJsonSchemaWidgets, getJsonSchemaTemplates, getJsonSchemaFields]
    );
};
