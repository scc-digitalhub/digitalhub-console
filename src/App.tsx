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
// import { LoginPage } from "./loginPage/LoginPage";
import { MyLayout } from './layout/MyLayout';
import { theme } from './layout/theme';
import { authHeader } from './provider/authProvider';
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
const httpClient = (url: string, options: fetchUtils.Options = {}) => {
    const customHeaders = (options.headers ||
        new Headers({
            Accept: 'application/json',
        })) as Headers;
    customHeaders.set('Authorization', 'Basic ' + authHeader());
    options.headers = customHeaders;
    return fetchUtils.fetchJson(url, options);
};
const dataProvider = appDataProvider(API_URL, httpClient);
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
                // authProvider={authProvider}
                // requireAuth={true}
            >
                <ResourceSchemaProvider
                    dataProvider={dataProvider}
                    resource="schemas"
                >
                    <AdminUI
                        dashboard={Dashboard}
                        layout={MyLayout}
                        // authProvider={authProvider}
                        // requireAuth={true}
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
                // authProvider={authProvider}
                // requireAuth={true}
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
