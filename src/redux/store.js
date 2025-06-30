import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import authReducer from "./slices/authSlice";
import selectChatReducer from "./slices/selectedUser";
import onlineUsersReducer from "./slices/onlineUsers"; // ✅ Correct import
import callReducer from "./slices/callSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  selectChat: selectChatReducer,
  onlineUsers: onlineUsersReducer,
  call: callReducer,
});

// Config for persisting store
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // only auth state will be persisted
};

// Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);
