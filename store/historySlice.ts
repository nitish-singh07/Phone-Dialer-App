import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  calls: [],
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    addCall: (state, action) => {
      state.calls.unshift(action.payload); // Add new call at the beginning
    },
  },
});

export const { addCall } = historySlice.actions;
export default historySlice.reducer;
