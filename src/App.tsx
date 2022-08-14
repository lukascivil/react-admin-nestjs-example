// Packages
import React, { FC } from 'react'
import { Admin, CustomRoutes, Resource } from 'react-admin'
import simpleRestProvider from 'ra-data-simple-rest'
import { Route } from 'react-router-dom'

// Resources
import { TasksList } from 'resources/tasks/task-list.component'
import { TasksCreate } from 'resources/tasks/task-create.component'
import { TasksShow } from 'resources/tasks/task-show.component'
import { TasksEdit } from 'resources/tasks/task-edit.component'
import { UsersList } from 'resources/users/users-list.component'

// Custom
import CustomList from 'resources/custom/custom-list.component'

// Providers
import authProvider from 'authProvider'
import httpClient from 'httpclient'
import { UsersCreate } from 'resources/users/users-create.component'
import { UsersEdit } from 'resources/users/users-edit.component'
import { UsersShow } from 'resources/users/users-show.components'
import { i18nProvider } from 'i18nProvider'
import { RtkList } from 'resources/rtk-test/rtk-list.component'
import createAdminStore from 'create-admin-store'
import { RtkShow } from 'resources/rtk-test/rtk-show.component'
import { RtkEdit } from 'resources/rtk-test/rtk-edit.component'
import { RtkCreate } from 'resources/rtk-test/rtk-create.component'
import { CustomLayout } from 'config/layout/custom-layout'
import { RtkCrudList } from 'resources/rtk-crud-users/rtk-crud-list.component'
import { RtkCrudShow } from 'resources/rtk-crud-users/rtk-crud-show.component'
import { Provider } from 'react-redux'

const dataProvider = simpleRestProvider('http://localhost:3000', httpClient)

const App: FC<any> = () => (
  <Provider store={createAdminStore()}>
    <Admin
      layout={CustomLayout}
      dataProvider={dataProvider as any}
      authProvider={authProvider}
      i18nProvider={i18nProvider}
    >
      <CustomRoutes>
        <Route path="/custom" element={<CustomList />} />,
        <Route path="/rtk-crud" element={<RtkCrudList />} />,
        <Route path="/rtk-crud/:id" element={<RtkCrudShow />} />,
        <Route path="/rtk" element={<RtkList />} />,
        <Route path="/rtk/create" element={<RtkCreate />} />,
        <Route path="/rtk/:id" element={<RtkShow />} />,
        <Route path="/rtk/:id/edit" element={<RtkEdit />} />
      </CustomRoutes>
      <Resource name="tasks" list={TasksList} create={TasksCreate} show={TasksShow} edit={TasksEdit} />
      <Resource name="users" list={UsersList} create={UsersCreate} show={UsersShow} edit={UsersEdit} />
    </Admin>
  </Provider>
)

export default App
