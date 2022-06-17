import { createSlice } from "@reduxjs/toolkit";
import { createMessage } from "../../common/utils/messagesSlice";

const initialState = {
	user: localStorage.getItem("user"),
	token: localStorage.getItem("token"),
	// isAuthenticated: null,
	isAuthenticated: !!localStorage.getItem("token"),
	isLoading: false,
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		loadingUser: (state) => {
			state.isLoading = true;
		},
		userLoaded: (state, action) => {
			state.user = action.payload;
			state.isLoading = false;
			state.isAuthenticated = true;
		},
		authSuccess: (state, action) => {
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", action.payload.user.username);
      state.user = action.payload.user;
			state.token = action.payload.token;
			state.isLoading = false;
			state.isAuthenticated = true;
		},
		authFail: (state) => {
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			state.user = null;
			state.token = null;
			state.isLoading = false;
			state.isAuthenticated = false;
		},
	},
});

export const {
  loadingUser,
  userLoaded,
  authSuccess,
  authFail,
} = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated  = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;

// ALIASES FOR REDUCERS
export const loginSuccess = (action) => (dispatch) => {
	dispatch(authSuccess(action));
  dispatch(createMessage({
    type: "Login Success",
    user: action.user,
    time: Date().toString(),
  }))
};
export const registerSuccess = (action) => (dispatch) => {
	dispatch(authSuccess(action));
	dispatch(createMessage({
    type: "Register Success",
    user: action.user,
    time: Date().toString(),
  }));
};
export const authError = (action) => (dispatch) => {
	dispatch(authFail(action));
};
// auth fail == logout success
export const loginFail = (action) => (dispatch) => {
	dispatch(authFail(action));
};
export const registerFail = (action) => (dispatch) => {
  dispatch(authFail(action));
};
export const logoutSuccess = (action) => (dispatch) => {
	dispatch(authFail(action));
};


export default authSlice.reducer;