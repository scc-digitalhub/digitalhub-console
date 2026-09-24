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
    version: number;
    loadModule: (id: string) => Promise<void>;
    loadModules: (ids: string[]) => Promise<void>;
    loadAllModules: () => Promise<void>;
    getComponent: (componentKey: string) => ComponentType<any> | undefined;
    getViewContributions: (
        resource: string,
        view: ConsoleViewName,
        showIn: ConsoleViewShowIn
    ) => ConsoleViewContribution[];
    getMenuContributions: () => ConsoleViewContribution[];
    getJsonSchemaWidgets: () => Record<string, ComponentType<any>>;
    getJsonSchemaTemplates: () => Record<string, ComponentType<any>>;
    getJsonSchemaFields: () => Record<string, ComponentType<any>>;
}

export interface UseViewContributionsOptions {
    showIn: ConsoleViewShowIn;
    resource?: string;
    view?: ConsoleViewName;
}
export interface ViewContributionElement {
    element: ReactElement;
    label?: string;
    id: string;
    icon?: ReactElement;
    path: string;
}
export interface ConsoleExtensionRegistryProviderProps {
    children: ReactNode;
    preloadModuleIds?: string[];
}

export const ConsoleExtensionRegistryContext = createContext<
    ConsoleExtensionRegistryContextValue | undefined
>(undefined);

export const ConsoleExtensionRegistryProvider = (
    props: ConsoleExtensionRegistryProviderProps
) => {
    const { children, preloadModuleIds = [] } = props;
    const loadedModulesRef = useRef(new Set<string>());

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);
    const [ready, setReady] = useState(preloadModuleIds.length === 0);
    const [version, forceRefresh] = useReducer((value: number) => value + 1, 0);

    const loadModule = useCallback(async (id: string) => {
        if (loadedModulesRef.current.has(id)) {
            return;
        }

        await consoleExtensionRegistry.loadModule(id);
        loadedModulesRef.current.add(id);
        forceRefresh();
    }, []);

    const loadModules = useCallback(
        async (ids: string[]) => {
            if (!ids.length) {
                return;
            }

            await Promise.all(ids.map(id => loadModule(id)));
        },
        [loadModule]
    );

    const getComponent = useCallback((componentKey: string) => {
        return consoleExtensionRegistry.getComponent(componentKey);
    }, []);

    const getViewContributions = useCallback(
        (
            resource: string,
            view: ConsoleViewName,
            showIn: ConsoleViewShowIn
        ) => {
            return consoleExtensionRegistry.getViewContributions(
                resource,
                view,
                showIn
            );
        },
        []
    );

    const getMenuContributions = useCallback(() => {
        return consoleExtensionRegistry.getMenuContributions();
    }, []);

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
            .catch(e => {
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
        version,
        loadModule,
        loadModules,
        loadAllModules,
        getComponent,
        getViewContributions,
        getMenuContributions,
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

// Returned when the hook is used outside a ConsoleExtensionRegistryProvider.
const noopConsoleExtensionRegistryValue: ConsoleExtensionRegistryContextValue =
{
    ready: false,
    loading: false,
    error: null,
    version: 0,
    loadModule: async () => { },
    loadModules: async () => { },
    loadAllModules: async () => { },
    getComponent: () => undefined,
    getViewContributions: () => [],
    getMenuContributions: () => [],
    getJsonSchemaWidgets: () => ({}),
    getJsonSchemaTemplates: () => ({}),
    getJsonSchemaFields: () => ({}),
};

export const useConsoleExtensionRegistry = () => {
    const value = useContext(ConsoleExtensionRegistryContext);

    return value ?? noopConsoleExtensionRegistryValue;
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


export const getExtensionRoutePath = (contributionId: string) =>
    `/ext/${encodeURIComponent(contributionId)}`;


const resolveContribution = (
    contribution: ConsoleViewContribution,
    getComponent: (key: string) => ComponentType<any> | undefined
): ViewContributionElement | null => {
    const ExtensionComponent = getComponent(contribution.componentKey);

    if (!ExtensionComponent) {
        return null;
    }

    const IconComponent = contribution.iconKey
        ? getComponent(contribution.iconKey)
        : undefined;

    const iconElement = IconComponent
        ? createElement(IconComponent, { key: contribution.id + '-icon' })
        : undefined;

    return {
        id: contribution.id,
        label: contribution.label,
        path: getExtensionRoutePath(contribution.id),
        element: createElement(ExtensionComponent, {
            key: contribution.id,
            ...(contribution.label && { label: contribution.label }),
            ...(iconElement && { icon: iconElement }),
        }),
        icon: iconElement,
    };
};


const resolveContributions = (
    contributions: ConsoleViewContribution[],
    getComponent: (key: string) => ComponentType<any> | undefined
): ViewContributionElement[] => {
    return contributions
        .map(contribution => resolveContribution(contribution, getComponent))
        .filter((item): item is ViewContributionElement => item !== null);
};


export const useViewContributions = (
    options: UseViewContributionsOptions
): ViewContributionElement[] => {
    const { loadAllModules, getComponent, getViewContributions, version } =
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
        loadAllModules().catch(error => {
            console.error('Unable to load console extension modules', error);
        });
    }, [loadAllModules]);

    return useMemo(() => {
        if (!resource || !view) {
            return [];
        }

        return resolveContributions(
            getViewContributions(resource, view, options.showIn),
            getComponent
        );
    }, [resource, view, options.showIn, getViewContributions, getComponent, version]);
};
export const useExtensionsMenuRoutes = (): ViewContributionElement[] => {
    const { loadAllModules, getComponent, getMenuContributions, version } =
        useConsoleExtensionRegistry();

    useEffect(() => {
        loadAllModules().catch(error => {
            console.error('Unable to load console extension modules', error);
        });
    }, [loadAllModules]);

    return useMemo(() => {
        return resolveContributions(getMenuContributions(), getComponent);
    }, [getMenuContributions, getComponent, version]);
};
export const useJsonSchemaContributions = () => {
    const {
        loadAllModules,
        getJsonSchemaWidgets,
        getJsonSchemaTemplates,
        getJsonSchemaFields,
    } = useConsoleExtensionRegistry();

    useEffect(() => {
        loadAllModules().catch(error => {
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
