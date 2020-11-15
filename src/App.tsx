// Packages
import React, { FC } from "react";
import { Admin, AdminProps, Resource } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";

// Resources
import { TasksList } from "resources/tasks/task-list.component";
import { TasksCreate } from "resources/tasks/task-create.component";
import { TasksShow } from "resources/tasks/task-show.component";
import { TasksEdit } from "resources/tasks/task-edit.component";

const dataProvider = simpleRestProvider("http://localhost:3000");
const App: FC<AdminProps> = () => (
  <Admin dataProvider={dataProvider}>
    <Resource
      name="tasks"
      list={TasksList}
      create={TasksCreate}
      show={TasksShow}
      edit={TasksEdit}
    />
  </Admin>
);

export default App;
