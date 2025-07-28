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
import { i18nProvider } from './provider/i18nProvider';
import appDataProvider from './provider/dataProvider';
import { MyLayout } from './layout/MyLayout';
import { themeProvider } from './provider/themeProvider';
import { LoginPage as OidcLoginPage } from '@dslab/ra-auth-oidc';
import { OidcAuthProvider, BasicAuthProvider } from './provider/authProvider';
import {
    RootSelectorContextProvider,
    RootSelectorInitialWrapper,
} from '@dslab/ra-root-selector';
import {
    ProjectSelectorList,
    ProjectEdit,
    ProjectCreate,
} from './resources/projects';
import {
    ArtifactList,
    ArtifactEdit,
    ArtifactCreate,
    ArtifactShow,
} from './resources/artifacts';
import {
    DataItemList,
    DataItemEdit,
    DataItemCreate,
    DataItemShow,
} from './resources/dataitems';
import {
    FunctionList,
    FunctionEdit,
    FunctionCreate,
    FunctionShow,
} from './resources/functions';
import {
    WorkflowList,
    WorkflowEdit,
    WorkflowCreate,
    WorkflowShow,
} from './resources/workflows';
import {
    SecretCreate,
    SecretEdit,
    SecretList,
    SecretShow,
} from './resources/secrets';

import { Dashboard } from './pages/dashboard/Dashboard';
import { Browser } from './files/Browser';
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

import { DataItemUpdate } from './resources/dataitems/update';
import { ArtifactUpdate } from './resources/artifacts/update';
import { ResourceSchemaProvider } from './provider/schemaProvider';
import { FunctionIcon } from './resources/functions/icon';
import { DataItemIcon } from './resources/dataitems/icon';
import { ArtifactIcon } from './resources/artifacts/icon';
import { SecretIcon } from './resources/secrets/icon';
import { WorkflowIcon } from './resources/workflows/icon';
import { ProjectConfig } from './resources/projects/config';
import { LayoutProjects } from './layout/LayoutProjects';
import { SearchList } from './search/SearchList';
import { SearchContextProvider } from './search/searchbar/SearchContextProvider';
import { createContext } from 'react';
import {
    ModelCreate,
    ModelEdit,
    ModelList,
    ModelShow,
    ModelUpdate,
} from './resources/models';
import { ModelIcon } from './resources/models/icon';
import runDefinition from './resources/runs';
import triggerDefinition from './resources/triggers';
import { StompContextProvider } from './contexts/StompContext';
import { ProjectLineage } from './pages/lineage/ProjectLineage';
import { StoreResetter } from './components/StoreResetter';
import { UploadStatusContextProvider } from './contexts/UploadStatusContext';
import { MyAccount } from './pages/account/MyAccount';

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
                                <UploadStatusContextProvider>
                                    <AdminUI
                                        dashboard={Dashboard}
                                        layout={WrappedLayout}
                                        loginPage={MyLoginPage}
                                        requireAuth={!!authProvider}
                                        disableTelemetry
                                    >
                                        <Resource
                                            name="functions"
                                            list={FunctionList}
                                            show={FunctionShow}
                                            edit={FunctionEdit}
                                            create={FunctionCreate}
                                            icon={FunctionIcon}
                                        />
                                        <Resource
                                            name="workflows"
                                            list={WorkflowList}
                                            show={WorkflowShow}
                                            edit={WorkflowEdit}
                                            create={WorkflowCreate}
                                            icon={WorkflowIcon}
                                        />
                                        <Resource
                                            name="dataitems"
                                            list={DataItemList}
                                            show={DataItemShow}
                                            edit={DataItemEdit}
                                            create={DataItemCreate}
                                            icon={DataItemIcon}
                                        >
                                            <Route
                                                path=":id/update"
                                                element={<DataItemUpdate />}
                                            />
                                        </Resource>
                                        <Resource
                                            name="models"
                                            list={ModelList}
                                            show={ModelShow}
                                            edit={ModelEdit}
                                            create={ModelCreate}
                                            icon={ModelIcon}
                                        >
                                            <Route
                                                path=":id/update"
                                                element={<ModelUpdate />}
                                            />
                                        </Resource>
                                        <Resource
                                            name="artifacts"
                                            list={ArtifactList}
                                            show={ArtifactShow}
                                            edit={ArtifactEdit}
                                            create={ArtifactCreate}
                                            icon={ArtifactIcon}
                                        >
                                            <Route
                                                path=":id/update"
                                                element={<ArtifactUpdate />}
                                            />
                                        </Resource>
                                        <Resource name="tasks" />
                                        <Resource {...runDefinition} />
                                        <Resource {...triggerDefinition} />
                                        <Resource
                                            name="projects"
                                            list={ProjectSelectorList}
                                            edit={ProjectEdit}
                                            create={ProjectCreate}
                                        />
                                        <Resource name="schemas" />
                                        <Resource name="logs" />
                                        <Resource name="metadatas" />
                                        <Resource
                                            name="secrets"
                                            list={SecretList}
                                            show={SecretShow}
                                            edit={SecretEdit}
                                            create={SecretCreate}
                                            icon={SecretIcon}
                                        />
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

                                            {enableSearch && (
                                                <Route
                                                    path="/searchresults"
                                                    element={<SearchList />}
                                                />
                                            )}
                                        </CustomRoutes>
                                    </AdminUI>
                                </UploadStatusContextProvider>
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
                <Resource
                    name="projects"
                    list={ProjectSelectorList}
                    edit={ProjectEdit}
                    create={ProjectCreate}
                />
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
