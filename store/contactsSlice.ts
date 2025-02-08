import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
};

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    addContact: (state, action) => {
      state.list.push(action.payload);
    },
  },
});

export const { addContact } = contactsSlice.actions;
export default contactsSlice.reducer;
