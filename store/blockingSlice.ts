import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface BlockedNumber {
  number: string;
  dateBlocked: string;
  reason?: string;
}

interface BlockingState {
  blockedNumbers: BlockedNumber[];
}

const initialState: BlockingState = {
  blockedNumbers: [],
};

const blockingSlice = createSlice({
  name: "blocking",
  initialState,
  reducers: {
    blockNumber: (state, action: PayloadAction<BlockedNumber>) => {
      state.blockedNumbers.push(action.payload);
      // Persist blocked numbers
      AsyncStorage.setItem(
        "blockedNumbers",
        JSON.stringify(state.blockedNumbers)
      );
    },
    unblockNumber: (state, action: PayloadAction<string>) => {
      state.blockedNumbers = state.blockedNumbers.filter(
        (item) => item.number !== action.payload
      );
      // Update persisted blocked numbers
      AsyncStorage.setItem(
        "blockedNumbers",
        JSON.stringify(state.blockedNumbers)
      );
    },
    setBlockedNumbers: (state, action: PayloadAction<BlockedNumber[]>) => {
      state.blockedNumbers = action.payload;
    },
  },
});

export const { blockNumber, unblockNumber, setBlockedNumbers } =
  blockingSlice.actions;
export default blockingSlice.reducer;
