import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
};

export const messagesSlice = createSlice({
	name: "messages",
	initialState,
	reducers: {
		createMessage: (state, action) => {
      state.messages = [...state.messages, action.payload]
    },
	},
});

export const { createMessage } = messagesSlice.actions;

export default messagesSlice.reducer;