import { configureStore } from "@reduxjs/toolkit";
import dialerReducer from "./dialerSlice";

const store = configureStore({
  reducer: {
    dialer: dialerReducer,
  },
});

export default store;
