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
		dispplayError: (state, action) => {
			state.msg = action.payload.msg;
			state.status = action.payload.status;
		},
		addError: (state, action) => {
			state.errors.push(action.payload);
		},
		returnErrors: (state, action) => {
			state.msg = action.payload.msg;
			state.status = action.payload.status;
			state.errors.push(action.payload);
		},
	},
});

export const { addError, dispplayError, returnErrors } = errorsSlice.actions;

export default errorsSlice.reducer;
