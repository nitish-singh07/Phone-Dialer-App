import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BlockedContact } from "../../types";

interface BlockingState {
  blockedNumbers: BlockedContact[];
}

const initialState: BlockingState = {
  blockedNumbers: [],
};

const blockingSlice = createSlice({
  name: "blocking",
  initialState,
  reducers: {
    blockNumber: (state, action: PayloadAction<BlockedContact>) => {
      state.blockedNumbers.push(action.payload);
    },
    unblockNumber: (state, action: PayloadAction<string>) => {
      state.blockedNumbers = state.blockedNumbers.filter(
        (item) => item.phoneNumber !== action.payload
      );
    },
    setBlockedNumbers: (state, action: PayloadAction<BlockedContact[]>) => {
      state.blockedNumbers = action.payload;
    },
  },
});

export const { blockNumber, unblockNumber, setBlockedNumbers } =
  blockingSlice.actions;
export default blockingSlice.reducer;
