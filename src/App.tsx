// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Admin,
    AdminContext,
    AdminUI,
    CustomRoutes,
    Resource,
    fetchUtils,
    localStorageStore,
} from 'react-admin';
import { BrowserRouter, Route } from 'react-router-dom';
import { i18nProvider } from './common/provider/i18nProvider';
import appDataProvider from './common/provider/dataProvider';
import { themeProvider } from './common/provider/themeProvider';
import { LoginPage as OidcLoginPage } from '@dslab/ra-auth-oidc';
import { OidcAuthProvider, BasicAuthProvider } from './common/provider/authProvider';
import {
    RootSelectorContextProvider,
    RootSelectorInitialWrapper,
} from '@dslab/ra-root-selector';
import { ProjectSelectorList } from './pages/projects/list';

import { Dashboard } from './pages/dashboard/components/Dashboard';
//config
const CONTEXT_PATH: string =
    import.meta.env.BASE_URL ||
    (globalThis as any).REACT_APP_CONTEXT_PATH ||
    (process.env.REACT_APP_CONTEXT_PATH as string);
const APPLICATION_URL: string =
    (globalThis as any).REACT_APP_APPLICATION_URL ||
    (process.env.REACT_APP_APPLICATION_URL as string);
const API_URL: string =
    (globalThis as any).REACT_APP_API_URL ||
    (process.env.REACT_APP_API_URL as string);
const AUTH_URL: string =
    (globalThis as any).REACT_APP_AUTH_URL ||
    (process.env.REACT_APP_AUTH_URL as string);
const WEBSOCKET_URL: string =
    (globalThis as any).REACT_APP_WEBSOCKET_URL ||
    (process.env.REACT_APP_WEBSOCKET_URL as string);

// oidc login
const ISSUER_URI: string =
    (globalThis as any).REACT_APP_ISSUER_URI ||
    (process.env.REACT_APP_ISSUER_URI as string);
const CLIENT_ID: string =
    (globalThis as any).REACT_APP_CLIENT_ID ||
    (process.env.REACT_APP_CLIENT_ID as string);
const SCOPE: string =
    (globalThis as any).REACT_APP_SCOPE ||
    (process.env.REACT_APP_SCOPE as string);

//basic auth login
const LOGIN_URL: string =
    (globalThis as any).REACT_APP_LOGIN_URL ||
    (process.env.REACT_APP_LOGIN_URL as string);

const applicationUrl =
    `${APPLICATION_URL}${CONTEXT_PATH}` ||
    `${window.location.origin}${CONTEXT_PATH}`;

const authProvider =
    ISSUER_URI && CLIENT_ID
        ? OidcAuthProvider({
              clientId: CLIENT_ID,
              issuer: ISSUER_URI,
              scope: SCOPE,
              loginUrl: AUTH_URL + LOGIN_URL,
              logoutTo: '/login',
              redirectUrl: applicationUrl.endsWith('/')
                  ? `${applicationUrl}auth-callback`
                  : `${applicationUrl}/auth-callback`,
          })
        : LOGIN_URL
        ? BasicAuthProvider({
              loginUrl: AUTH_URL + LOGIN_URL,
              logoutTo: '/login',
          })
        : undefined;

const httpClient = async (url: string, options: fetchUtils.Options = {}) => {
    const headers = (options.headers ||
        new Headers({
            Accept: 'application/json',
        })) as Headers;
    if (authProvider) {
        const authHeader = await authProvider.getAuthorization();
        if (authHeader) {
            headers.set('Authorization', authHeader);
        }
    }

    options.headers = headers;
    return fetchUtils.fetchJson(url, options);
};

const dataProvider = appDataProvider(API_URL, httpClient);
const MyLoginPage =
    authProvider && ISSUER_URI && CLIENT_ID ? <OidcLoginPage /> : undefined;

const theme = themeProvider();

const enableSearch: boolean =
    (globalThis as any).REACT_APP_ENABLE_SOLR === 'true' ||
    (process.env.REACT_APP_ENABLE_SOLR as string) === 'true';

import { ResourceSchemaProvider } from './common/provider/schemaProvider';
import { ProjectConfig } from './pages/projects/config';
import { SearchList } from './features/search/components/SearchList';
import { SearchContextProvider } from './features/search/SearchContextProvider';
import { createContext } from 'react';
import artifactDefinition from './pages/artifacts';
import dataitemDefinition from './pages/dataitems';
import functionDefinition from './pages/functions';
import modelDefinition from './pages/models';
import workflowDefinition from './pages/workflows';
import secretDefinition from './pages/secrets';
import projectDefinition from './pages/projects';
import runDefinition from './pages/runs';
import triggerDefinition from './pages/triggers';
import { StompContextProvider } from './features/notifications/StompContextProvider';
import { ProjectLineage } from './pages/projects/components/ProjectLineage';
import { StoreResetter } from './common/utils/StoreResetter';
import { MyAccount } from './features/account/components/MyAccount';
import { ServiceList } from './features/httpclients/components/list';
import { FileContextProvider } from './features/files/FileContextProvider';
import { Browser } from './features/files/fileBrowser/components/Browser';
import { LayoutProjects } from './layout/LayoutProjects';
import { MyLayout } from './layout/MyLayout';

export const SearchEnabledContext = createContext(false);

const WrappedLayout = (props: any) => {
    return (
        <SearchEnabledContext.Provider value={enableSearch}>
            <MyLayout {...props} />
        </SearchEnabledContext.Provider>
    );
};

const CoreApp = () => {
    return (
        <RootSelectorContextProvider
            resource="projects"
            initialApp={<InitialWrapper />}
        >
            <AdminContext
                dashboard={Dashboard}
                i18nProvider={i18nProvider}
                dataProvider={dataProvider}
                theme={theme.light}
                defaultTheme="light"
                lightTheme={theme.light}
                darkTheme={theme.dark}
                authProvider={authProvider}
                store={localStorageStore('dh')}
            >
                <StoreResetter>
                    <SearchContextProvider searchProvider={dataProvider}>
                        <ResourceSchemaProvider
                            dataProvider={dataProvider}
                            resource="schemas"
                        >
                            <StompContextProvider
                                authProvider={authProvider}
                                websocketUrl={WEBSOCKET_URL}
                                topics={['/user/notifications/runs']}
                            >
                                <FileContextProvider
                                    fileProvider={dataProvider}
                                >
                                    <AdminUI
                                        dashboard={Dashboard}
                                        layout={WrappedLayout}
                                        loginPage={MyLoginPage}
                                        requireAuth={!!authProvider}
                                        disableTelemetry
                                    >
                                        <Resource {...functionDefinition} />
                                        <Resource {...workflowDefinition} />
                                        <Resource {...dataitemDefinition} />
                                        <Resource {...modelDefinition} />
                                        <Resource {...artifactDefinition} />
                                        <Resource name="tasks" />
                                        <Resource {...runDefinition} />
                                        <Resource {...triggerDefinition} />
                                        <Resource {...projectDefinition} />
                                        <Resource {...secretDefinition} />
                                        <Resource name="schemas" />
                                        <Resource name="logs" />
                                        <Resource name="metadatas" />
                                        <Resource name="labels" />
                                        <Resource name="templates" />
                                        <CustomRoutes>
                                            <Route
                                                path="/config"
                                                element={<ProjectConfig />}
                                            />

                                            <Route
                                                path="/lineage"
                                                element={<ProjectLineage />}
                                            />

                                            <Route
                                                path="/account"
                                                element={<MyAccount />}
                                            />
                                            <Route
                                                path="/files"
                                                element={<Browser />}
                                            />
                                            <Route
                                                path="/services"
                                                element={<ServiceList />}
                                            />
                                            {enableSearch && (
                                                <Route
                                                    path="/searchresults"
                                                    element={<SearchList />}
                                                />
                                            )}
                                        </CustomRoutes>
                                    </AdminUI>
                                </FileContextProvider>
                            </StompContextProvider>
                        </ResourceSchemaProvider>
                    </SearchContextProvider>
                </StoreResetter>
            </AdminContext>
        </RootSelectorContextProvider>
    );
};

const InitialWrapper = () => {
    return (
        <RootSelectorInitialWrapper
            resource="projects"
            selector={<ProjectSelectorList />}
        >
            <Admin
                layout={LayoutProjects}
                i18nProvider={i18nProvider}
                dataProvider={dataProvider}
                theme={theme.light}
                defaultTheme="light"
                lightTheme={theme.light}
                darkTheme={theme.dark}
                authProvider={authProvider}
                loginPage={MyLoginPage}
                requireAuth={!!authProvider}
                store={localStorageStore('dh')}
                disableTelemetry
            >
                <Resource {...projectDefinition} />
                <Resource name="tokens/refresh" />
                <Resource name="tokens/personal" />
                <Resource name="schemas" />
                <CustomRoutes>
                    <Route path="/account" element={<MyAccount />} />
                </CustomRoutes>
            </Admin>
        </RootSelectorInitialWrapper>
    );
};

export const App = () => {
    return (
        <BrowserRouter basename={CONTEXT_PATH}>
            <CoreApp />
        </BrowserRouter>
    );
};
