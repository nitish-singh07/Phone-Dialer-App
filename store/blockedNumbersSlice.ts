import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BlockedNumber {
  number: string;
  dateBlocked: string;
}

interface BlockedNumbersState {
  numbers: BlockedNumber[];
}

const initialState: BlockedNumbersState = {
  numbers: [],
};

const blockedNumbersSlice = createSlice({
  name: "blockedNumbers",
  initialState,
  reducers: {
    blockNumber: (state, action: PayloadAction<string>) => {
      state.numbers.push({
        number: action.payload,
        dateBlocked: new Date().toISOString(),
      });
    },
    unblockNumber: (state, action: PayloadAction<string>) => {
      state.numbers = state.numbers.filter(
        (item) => item.number !== action.payload
      );
    },
  },
});

export const { blockNumber, unblockNumber } = blockedNumbersSlice.actions;
export default blockedNumbersSlice.reducer;
