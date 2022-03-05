// Packages
import React, { FC } from 'react'
import { Admin, Resource } from 'react-admin'
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
import { createHashHistory } from 'history'
import { Provider } from 'react-redux'
import createAdminStore from 'create-admin-store'
import { RtkShow } from 'resources/rtk-test/rtk-show.component'
import { RtkEdit } from 'resources/rtk-test/rtk-edit.component'
import { RtkCreate } from 'resources/rtk-test/rtk-create.component'
import { CustomLayout } from 'config/layout/custom-layout'
import { RtkCrudList } from 'resources/rtk-crud-users/rtk-crud-list.component'
import { RtkCrudShow } from 'resources/rtk-crud-users/rtk-crud-show.component'

const dataProvider = simpleRestProvider('http://localhost:3000', httpClient)

const history = createHashHistory()

const App: FC<any> = () => (
  <Provider
    store={createAdminStore({
      authProvider,
      dataProvider,
      history
    })}
  >
    <Admin
      layout={CustomLayout}
      dataProvider={dataProvider as any}
      authProvider={authProvider}
      i18nProvider={i18nProvider}
      history={history}
      customRoutes={[
        <Route exact path="/custom" component={CustomList} />,
        <Route exact path="/rtk-crud" component={RtkCrudList} />,
        <Route exact path="/rtk-crud/:id" component={RtkCrudShow} />,
        <Route exact path="/rtk" component={RtkList} />,
        <Route exact path="/rtk/create" component={RtkCreate} />,
        <Route exact path="/rtk/:id" component={RtkShow} />,
        <Route exact path="/rtk/:id/edit" component={RtkEdit} />
      ]}
    >
      <Resource name="tasks" list={TasksList} create={TasksCreate} show={TasksShow} edit={TasksEdit} />
      <Resource name="users" list={UsersList} create={UsersCreate} show={UsersShow} edit={UsersEdit} />
    </Admin>
  </Provider>
)

export default App
