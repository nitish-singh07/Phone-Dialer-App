import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  number: "",
};

const dialerSlice = createSlice({
  name: "dialer",
  initialState,
  reducers: {
    addDialedNumber: (state, action) => {
      state.number = action.payload;
    },
    clearNumber: (state) => {
      state.number = "";
    },
  },
});

export const { addDialedNumber, clearNumber } = dialerSlice.actions;
export default dialerSlice.reducer;
