import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "../reducers/authSlice";
import UserChatSlice from "../reducers/UserchatSlice";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { persistReducer, persistStore } from "redux-persist";

// Combine your slices
const rootReducer = combineReducers({
  auth: authSlice,
  chat: UserChatSlice,
});

// Persist config (choose which slices to persist)
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "chat"], // only persist these reducers
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  // Add this middleware to avoid non-serializable warning from redux-persist
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
});

export const persistor = persistStore(store);
export default store;
