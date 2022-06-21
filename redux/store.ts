import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";

const rootReducer = combineReducers({
  authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type rootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
