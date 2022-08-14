// Packages
import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import { usersApi } from 'store/api/users-api'
import { resourcesApi } from 'store/api/resources-api'
import { healthApi } from 'store/api/health-api'
import { usersCrudApi } from 'store/api/users-crud-api.rtk'

const createAdminStore = () => {
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
