import { configureStore } from "@reduxjs/toolkit";
import dialerReducer from "./slices/dialerSlice";
import historyReducer from "./slices/historySlice";
import blockingReducer from "./slices/blockingSlice";
import themeReducer from "./slices/themeSlice";
import contactsReducer from "./slices/contactsSlice";

export const store = configureStore({
  reducer: {
    dialer: dialerReducer,
    history: historyReducer,
    blocking: blockingReducer,
    theme: themeReducer,
    contacts: contactsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
