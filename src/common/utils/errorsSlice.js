import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	msg: {},
	status: null,
	errors: [],
};

export const errorsSlice = createSlice({
	name: "errors",
	initialState,
	reducers: {
		addError: (state, action) => {
			state.errors.push(action.payload);
		},
		displayError: (state, action) => {
			state.msg = action.payload.msg;
			state.status = action.payload.status;
		},
		returnErrors: (state, action) => {
			state.msg = action.payload.msg;
			state.status = action.payload.status;
			state.errors.push(action.payload);
		},
	},
});

export const { addError, displayError, returnErrors } = errorsSlice.actions;

export default errorsSlice.reducer;
