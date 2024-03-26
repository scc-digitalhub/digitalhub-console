import {
    Admin,
    AdminContext,
    AdminUI,
    CustomRoutes,
    Resource,
    fetchUtils,
} from 'react-admin';
import { BrowserRouter, Route } from 'react-router-dom';
import { i18nProvider } from './i18n/i18nProvider';
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

import { DataItemUpdate } from './resources/dataitems/update';
import { ArtifactUpdate } from './resources/artifacts/update';
import { TaskEdit } from './resources/tasks';
import { RunShow, RunCreate } from './resources/runs';
import { ResourceSchemaProvider } from './provider/schemaProvider';
import { FunctionIcon } from './resources/functions/icon';
import { DataItemIcon } from './resources/dataitems/icon';
import { ArtifactIcon } from './resources/artifacts/icon';
import { SecretIcon } from './resources/secrets/icon';
import { WorkflowIcon } from './resources/workflows/icon';
import { ProjectConfig } from './resources/projects/config';
import { LayoutProjects } from './layout/LayoutProjects';
import { SearchList } from './components/SearchList';
import {
    Search,
} from '@dslab/ra-search-bar';
const CoreApp = () => {
    return (
        <Search searchProvider={dataProvider}>
        <RootSelectorContextProvider
            resource="projects"
            initialApp={<InitialWrapper />}
        >
            <AdminContext
                dashboard={Dashboard}
                i18nProvider={i18nProvider}
                dataProvider={dataProvider}
                theme={theme}
                authProvider={authProvider}
            >
                <ResourceSchemaProvider
                    dataProvider={dataProvider}
                    resource="schemas"
                >
                    <AdminUI
                        dashboard={Dashboard}
                        layout={MyLayout}
                        loginPage={MyLoginPage}
                        requireAuth={!!authProvider}
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
                        <Resource name="tasks" edit={TaskEdit}></Resource>
                        <Resource
                            name="runs"
                            show={RunShow}
                            create={RunCreate}
                        ></Resource>
                        <Resource
                            name="projects"
                            list={ProjectSelectorList}
                            edit={ProjectEdit}
                            create={ProjectCreate}
                        />
                        <Resource name="schemas" />
                        <Resource
                            name="secrets"
                            list={SecretList}
                            show={SecretShow}
                            edit={SecretEdit}
                            create={SecretCreate}
                            icon={SecretIcon}
                        ></Resource>
                        <CustomRoutes>
                            <Route path="/config" element={<ProjectConfig />} />
                        </CustomRoutes>
                        <CustomRoutes>
                        <Route path="/searchresults" element={<SearchList />} />
                    </CustomRoutes>
                    </AdminUI>
                </ResourceSchemaProvider>
            </AdminContext>
        </RootSelectorContextProvider>
        </Search>

    );
};

const InitialWrapper = () => {
    return (
        <RootSelectorInitialWrapper
            resource="projects"
            selector={<ProjectSelectorList />}
        >
            <Admin
                dashboard={Dashboard}
                layout={LayoutProjects}
                i18nProvider={i18nProvider}
                dataProvider={dataProvider}
                theme={theme}
                authProvider={authProvider}
                loginPage={MyLoginPage}
                requireAuth={!!authProvider}
            >
                <Resource
                    name="projects"
                    list={ProjectSelectorList}
                    edit={ProjectEdit}
                    create={ProjectCreate}
                />
                <Resource name="schemas" />
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
