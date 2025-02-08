import { configureStore } from "@reduxjs/toolkit";
import dialerReducer from "./dialerSlice";
import contactsReducer from "./contactsSlice";
import historyReducer from "./historySlice";
import themeReducer from "./themeSlice";
import blockedNumbersReducer from "./blockedNumbersSlice";
import blockingReducer from "./blockingSlice";

export const store = configureStore({
  reducer: {
    dialer: dialerReducer,
    contacts: contactsReducer,
    history: historyReducer,
    theme: themeReducer,
    blockedNumbers: blockedNumbersReducer,
    blocking: blockingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
