import { Admin, Resource, fetchUtils } from "react-admin";
import { i18nProvider } from "./i18n/i18nProvider";
import appDataProvider from "./provider/dataProvider";
// import { LoginPage } from "./loginPage/LoginPage";
import { MyLayout } from "./layout/MyLayout";
import { theme } from "./layout/theme";
import authProvider, { authHeader } from "./provider/authProvider";
import { RootSelector } from "@dslab/ra-root-selector";
import {
  ProjectSelectorList,
  ProjectEdit,
  ProjectCreate,
} from "./resources/projects";
import {
  ArtifactList,
  ArtifactEdit,
  ArtifactCreate,
  ArtifactShow,
} from "./resources/artifacts";
import {
  DataItemList,
  DataItemEdit,
  DataItemCreate,
  DataItemShow,
} from "./resources/dataitems";
import {
  FunctionList,
  FunctionEdit,
  FunctionCreate,
  FunctionShow,
} from "./resources/functions";

const API_URL: string = process.env.REACT_APP_API_URL as string;
const httpClient = (url: string, options: fetchUtils.Options = {}) => {
  const customHeaders = (options.headers ||
    new Headers({
      Accept: "application/json",
    })) as Headers;
  customHeaders.set("Authorization", "Basic " + authHeader());
  options.headers = customHeaders;
  return fetchUtils.fetchJson(url, options);
};
const dataProvider = appDataProvider(API_URL, httpClient);

export const App = () => {
  return (
    <RootSelector resource="projects" selector={<ProjectSelectorList />}>
      <Admin 
        layout={MyLayout}
        i18nProvider={i18nProvider}
        dataProvider={dataProvider}
        theme={theme}
        authProvider={authProvider}
        requireAuth={true}
      >
        <Resource
          name="functions"
          list={<FunctionList />}
          show={<FunctionShow />}
          edit={<FunctionEdit />}
          create={<FunctionCreate />}
        />
        <Resource
          name="dataitems"
          list={<DataItemList />}
          show={<DataItemShow />}
          edit={<DataItemEdit />}
          create={<DataItemCreate />}
        />
        <Resource
          name="artifacts"
          list={<ArtifactList />}
          show={<ArtifactShow />}
          edit={<ArtifactEdit />}
          create={<ArtifactCreate />}
        />
        <Resource
          name="projects"
          list={ProjectSelectorList}
          edit={ProjectEdit}
          create={ProjectCreate}
        />
      </Admin>
    </RootSelector>
  );
};
