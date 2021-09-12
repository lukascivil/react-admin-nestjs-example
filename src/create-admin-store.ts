// Packages
import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import createSagaMiddleware from 'redux-saga'
import { adminReducer, adminSaga, AuthProvider, DataProvider, USER_LOGOUT } from 'react-admin'
import { configureStore } from '@reduxjs/toolkit'
import { usersApi } from 'store/api/users-api'
import { History } from 'history'
import { all, fork } from 'redux-saga/effects'
import { resourcesApi } from 'store/api/resources-api'
import { healthApi } from 'store/api/health-api'

interface CreateAdminStore {
  authProvider: AuthProvider
  dataProvider: DataProvider
  history: History
}

const createAdminStore = ({ authProvider, dataProvider, history }: CreateAdminStore) => {
  const reducer = combineReducers({
    admin: adminReducer,
    router: connectRouter(history),
    [usersApi.reducerPath]: usersApi.reducer,
    [resourcesApi.reducerPath]: resourcesApi.reducer,
    [healthApi.reducerPath]: healthApi.reducer
  })
  const resettableAppReducer = (state, action) => reducer(action.type !== USER_LOGOUT ? state : undefined, action)

  const saga = function* rootSaga() {
    yield all(
      [
        adminSaga(dataProvider, authProvider)
        // add your own sagas here
      ].map(fork)
    )
  }
  const sagaMiddleware = createSagaMiddleware()

  const store = configureStore({
    reducer: resettableAppReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({ serializableCheck: false }).concat([usersApi.middleware, sagaMiddleware]),
    devTools: true
  })

  sagaMiddleware.run(saga)

  return store
}

export default createAdminStore
