// Packages
import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import createSagaMiddleware from "redux-saga";
import { adminReducer, USER_LOGOUT } from "react-admin";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { usersApi } from "resources/rtk-test/users-api";

// Stores

interface CreateAdminStore {
  authProvider: any;
  dataProvider: any;
  history: any;
}

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const createAdminStore = ({
  authProvider,
  dataProvider,
  history,
}: CreateAdminStore) => {
  const reducer = combineReducers({
    admin: adminReducer,
    router: connectRouter(history),
    [usersApi.reducerPath]: usersApi.reducer,
  });
  const resettableAppReducer = (state, action) =>
    reducer(action.type !== USER_LOGOUT ? state : undefined, action);

  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer: resettableAppReducer,
    middleware: [
      ...getDefaultMiddleware().concat(usersApi.middleware),
      sagaMiddleware,
    ],
    devTools: true,
  });

  return store;
};

export default createAdminStore;
