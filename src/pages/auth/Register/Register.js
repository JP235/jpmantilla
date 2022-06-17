import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Navigate } from "react-router";
import { register } from "../../../api/auth/auth";
import { selectIsAuthenticated } from "../../../api/auth/authAPISlice";

const Register = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [password2, setPassword2] = useState("");
  const [passMAtchWarning, setPassMatchWarning] = useState(false);

	const dispatch = useDispatch();
	const isAuthenticated = useSelector(selectIsAuthenticated);

	const onSubmit = (e) => {
		if (password !== password2) {
      setPassMatchWarning(true);
    } else {
      console.log("dispatch")
			e.preventDefault();
			dispatch(register(email, password));
		}
	};

	if (isAuthenticated) {
		return <Navigate to="/" />;
	}

	return (
		<div>
      {passMAtchWarning && <p>Passwords do not match</p>}
			<form onSubmit={onSubmit}>
				<label htmlFor="email">Email address:</label> <br />
				<input
					name="email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>{" "}
				<br />
				<label htmlFor="password1">Password:</label> <br />
				<input
					name="password"
					type="password"
					autoComplete="on"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>{" "}
				<br />
				<label htmlFor="password2">Confirm password:</label> <br />
				<input
					name="password2"
					type="password"
					autoComplete="on"
					value={password2}
					onChange={(e) => setPassword2(e.target.value)}
					required
				/>{" "}
				<br />
				<input type="submit" value="Signup" />
			</form>
		</div>
	);
};

export default Register;
