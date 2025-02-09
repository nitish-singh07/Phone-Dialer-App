import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DialerState {
  number: string;
}

const initialState: DialerState = {
  number: "",
};

const dialerSlice = createSlice({
  name: "dialer",
  initialState,
  reducers: {
    addDialedNumber: (state, action: PayloadAction<string>) => {
      state.number = action.payload;
    },
    clearNumber: (state) => {
      state.number = "";
    },
    deleteLastDigit: (state) => {
      state.number = state.number.slice(0, -1);
    },
  },
});

export const { addDialedNumber, clearNumber, deleteLastDigit } =
  dialerSlice.actions;
export default dialerSlice.reducer;
