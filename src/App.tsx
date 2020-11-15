import "./App.css";

import React from "react";
import { Admin, Resource } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";

// Resources
import { TasksList } from "resources/tasks/task-list.component";
import { TasksCreate } from "resources/tasks/task-create.component";

const dataProvider = simpleRestProvider("http://localhost:3000");
const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="tasks" list={TasksList} create={TasksCreate} />
  </Admin>
);

export default App;
