// Packages
import { combineReducers } from 'redux'
import { AuthProvider, DataProvider } from 'react-admin'
import { configureStore } from '@reduxjs/toolkit'
import { usersApi } from 'store/api/users-api'
import { History } from 'history'
import { resourcesApi } from 'store/api/resources-api'
import { healthApi } from 'store/api/health-api'
import { usersCrudApi } from 'store/api/users-crud-api.rtk'

interface CreateAdminStore {
  authProvider: AuthProvider
  dataProvider: DataProvider
  history: History
}

const createAdminStore = ({ authProvider, dataProvider, history }: CreateAdminStore) => {
  const reducer = combineReducers({
    [usersApi.reducerPath]: usersApi.reducer,
    [resourcesApi.reducerPath]: resourcesApi.reducer,
    [healthApi.reducerPath]: healthApi.reducer,
    [usersCrudApi.reducerPath]: usersCrudApi.reducer
  })

  const store = configureStore({
    reducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat([
        usersApi.middleware,
        healthApi.middleware,
        resourcesApi.middleware,
        usersCrudApi.middleware
      ]),
    devTools: true
  })

  return store
}

export default createAdminStore
