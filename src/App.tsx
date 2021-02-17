// Packages
import React, { FC } from "react";
import { Admin, Resource } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";
import { Route } from "react-router-dom";

// Resources
import { TasksList } from "resources/tasks/task-list.component";
import { TasksCreate } from "resources/tasks/task-create.component";
import { TasksShow } from "resources/tasks/task-show.component";
import { TasksEdit } from "resources/tasks/task-edit.component";
import { UsersList } from "resources/users/users-list.component";

// Custom
import CustomList from "resources/custom/custom-list.component";

// Providers
import authProvider from "authProvider";
import httpClient from "httpclient";
import { UsersCreate } from "resources/users/users-create.component";
import { UsersEdit } from "resources/users/users-edit.component";
import { UsersShow } from "resources/users/users-show.components";
import { i18nProvider } from "i18nProvider";

const dataProvider = simpleRestProvider("http://localhost:3000", httpClient);

const App: FC<any> = () => (
  <Admin
    dataProvider={dataProvider as any}
    authProvider={authProvider}
    i18nProvider={i18nProvider}
    customRoutes={[<Route exact path="/custom" component={CustomList} />]}
  >
    <Resource
      name="tasks"
      list={TasksList}
      create={TasksCreate}
      show={TasksShow}
      edit={TasksEdit}
    />
    <Resource
      name="users"
      list={UsersList}
      create={UsersCreate}
      show={UsersShow}
      edit={UsersEdit}
    />
  </Admin>
);

export default App;
