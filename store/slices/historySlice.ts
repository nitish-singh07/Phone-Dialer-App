import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CallLogEntry } from "../../types";

interface HistoryState {
  logs: CallLogEntry[];
}

const initialState: HistoryState = {
  logs: [],
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    addCallLog: (state, action: PayloadAction<CallLogEntry>) => {
      state.logs.unshift(action.payload);
    },
    clearHistory: (state) => {
      state.logs = [];
    },
    setCallLogs: (state, action: PayloadAction<CallLogEntry[]>) => {
      state.logs = action.payload;
    },
  },
});

export const { addCallLog, clearHistory, setCallLogs } = historySlice.actions;
export default historySlice.reducer;
