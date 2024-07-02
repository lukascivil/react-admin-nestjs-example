// Packages
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { usersApi } from 'store/api/users-api'
import { resourcesApi } from 'store/api/resources-api'
import { healthApi } from 'store/api/health-api'

const createAdminStore = () => {
  const reducer = combineReducers({
    [usersApi.reducerPath]: usersApi.reducer,
    [resourcesApi.reducerPath]: resourcesApi.reducer,
    [healthApi.reducerPath]: healthApi.reducer
  })

  const store = configureStore({
    reducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat([usersApi.middleware, healthApi.middleware, resourcesApi.middleware]),
    devTools: true
  })

  return store
}

export default createAdminStore
