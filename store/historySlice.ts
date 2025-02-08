import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CallLog {
  id: string;
  number: string;
  type: "incoming" | "outgoing" | "missed";
  time: string;
}

interface HistoryState {
  logs: CallLog[];
}

const initialState: HistoryState = {
  logs: [],
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    addCallLog: (state, action: PayloadAction<CallLog>) => {
      state.logs.unshift(action.payload);
    },
    clearHistory: (state) => {
      state.logs = [];
    },
  },
});

export const { addCallLog, clearHistory } = historySlice.actions;
export default historySlice.reducer;
