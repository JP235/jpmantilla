import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Link , useNavigate} from "react-router-dom";
import { login } from "../../../api/auth/auth";
import {selectIsAuthenticated} from "../../../api/auth/authAPISlice"

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(selectIsAuthenticated);

	const onSubmit = (e) => {
		e.preventDefault();
		dispatch(login(username, password));
	};

	if (isAuthenticated) {
		return navigate(-1);
	}

	return (
		<div className="col-md-6 m-auto">
			<div className="card card-body mt-5">
				<h2 className="text-center">Login</h2>
				<form onSubmit={onSubmit}>
					<div className="form-group">
						<label>Username</label>
						<input
							type="text"
							name="username"
							onChange={(e) => setUsername(e.target.value)}
							value={username}
						/>
					</div>

					<div className="form-group">
						<label>Password</label>
						<input
							type="password"
							name="password"
              autoComplete="on"
							onChange={(e) => setPassword(e.target.value)}
							value={password}
						/>
					</div>

					<div className="form-group">
						<button type="submit" className="btn btn-primary">
							Login
						</button>
					</div>
					<p>
						Don't have an account?{" "}
						<Link to="/register">Register</Link>
					</p>
				</form>
			</div>
		</div>
	);
};

export default Login;
