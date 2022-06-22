import axios from "axios";

import { SERVER_URL, LOCAL_URL } from "../urlconfig";
import { tokenConfig } from "../tokenConfig";
import { returnErrors } from "../../common/utils/errorsSlice";
import {
	loadingUser,
	userLoaded,
	loginSuccess,
	registerSuccess,
	logoutSuccess,
	authError,
	loginFail,
	registerFail,
} from "./authAPISlice";

const base_req_url = SERVER_URL;

// CHECK TOKEN & LOAD USER
export const loadUser = () => (dispatch, getState) => {
	// User Loading
	dispatch(loadingUser());
	axios
		.get(base_req_url+"api/auth/user", tokenConfig(getState))
		.then((res) => {
			dispatch(userLoaded(res.data));
		})
		.catch((err) => {
      console.log(err)
			dispatch(authError());
			dispatch(
				returnErrors({
					msg: err.response.data,
					status: err.response.status,
				})
			);
		});
};

// LOGIN USER
export const login = (username, password) => (dispatch) => {
	// Headers
	const config = {
		headers: {
			"Content-Type": "application/json",
		},
	};
	const user = {
		username: username,
		password: password,
	};
	// Request Body
	const body = JSON.stringify(user);
	axios
		.post(base_req_url+"api/auth/login/", body, config)
		.then((res) => {
			dispatch(loginSuccess(res.data));
		})
		.catch((err) => {
			dispatch(loginFail());
			console.log(err);
			dispatch(
				returnErrors({
					msg: err.response.data,
					status: err.response.status,
				})
			);
		});
};

// REGISTER USER
export const register =
	(email, password) =>
	(dispatch) => {
		// Headers
		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};
    console.log("register");

		// Request Body
		const body = JSON.stringify({ email, password });
		axios
			.post(base_req_url+"api/auth/register", body, config)
			.then((res) => {
				dispatch(registerSuccess(res.data));
			})
			.catch((err) => {
				console.log(err);
				dispatch(registerFail());
			});
	};

// LOGOUT USER
export const logout = () => (dispatch, getState) => {
	axios
		.post(base_req_url+"api/auth/logout/", null, tokenConfig(getState))
		.then((res) => {
			dispatch(logoutSuccess());
		})
		.catch((err) => {
      console.log(err)
			dispatch(
				returnErrors({
					msg: err.response.data,
					status: err.response.status,
				})
			);
		});
};
