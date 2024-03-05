import {
    Admin,
    AdminContext,
    AdminUI,
    Resource,
    fetchUtils,
} from 'react-admin';
import { BrowserRouter, Route } from 'react-router-dom';
import { i18nProvider } from './i18n/i18nProvider';
import appDataProvider from './provider/dataProvider';
import { MyLayout } from './layout/MyLayout';
import { theme } from './layout/theme';
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
import { Dashboard } from './pages/Dashboard';

const API_URL: string = process.env.REACT_APP_API_URL as string;
const ISSUER_URI: string = process.env.REACT_APP_ISSUER_URI as string;
const CLIENT_ID: string = process.env.REACT_APP_CLIENT_ID as string;
const LOGIN_URL: string = process.env.REACT_APP_LOGIN_URL as string;

const authProvider =
    ISSUER_URI && CLIENT_ID
        ? OidcAuthProvider({
              clientId: CLIENT_ID,
              issuer: ISSUER_URI,
              scope: 'openid profile email user.roles.me',
              logoutTo: '/login',
          })
        : LOGIN_URL
        ? BasicAuthProvider({
              loginUrl: API_URL + LOGIN_URL,
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

import { FunctionUpdate } from './resources/functions/update';
import { DataItemUpdate } from './resources/dataitems/update';
import { ArtifactUpdate } from './resources/artifacts/update';
import { TaskEdit } from './resources/tasks';
import { RunShow, RunCreate, RunList } from './resources/runs';
import { ResourceSchemaProvider } from './provider/schemaProvider';

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
                            list={<FunctionList />}
                            show={<FunctionShow />}
                            edit={<FunctionEdit />}
                            create={<FunctionCreate />}
                        >
                            <Route
                                path=":id/update"
                                element={<FunctionUpdate />}
                            />
                        </Resource>
                        <Resource
                            name="dataitems"
                            list={<DataItemList />}
                            show={<DataItemShow />}
                            edit={<DataItemEdit />}
                            create={<DataItemCreate />}
                        >
                            <Route
                                path=":id/update"
                                element={<DataItemUpdate />}
                            />
                        </Resource>
                        <Resource
                            name="artifacts"
                            list={<ArtifactList />}
                            show={<ArtifactShow />}
                            edit={<ArtifactEdit />}
                            create={<ArtifactCreate />}
                        >
                            <Route
                                path=":id/update"
                                element={<ArtifactUpdate />}
                            />
                        </Resource>
                        <Resource name="tasks" edit={<TaskEdit />}></Resource>
                        <Resource
                            name="runs"
                            show={<RunShow />}
                            create={<RunCreate />}
                            list={<RunList />}
                        ></Resource>
                        <Resource
                            name="projects"
                            list={ProjectSelectorList}
                            edit={ProjectEdit}
                            create={ProjectCreate}
                        />
                        <Resource name="schemas" />
                    </AdminUI>
                </ResourceSchemaProvider>
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
                dashboard={Dashboard}
                layout={MyLayout}
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
        <BrowserRouter basename={''}>
            <CoreApp />
        </BrowserRouter>
    );
};
