import React from "react";
// import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../../api/auth/authAPISlice";

const LoginStatus = () => {
	const user = useSelector(selectUser);
	const isAuthenticated = useSelector(selectIsAuthenticated);

	return (
		<div className="login-status">

			{isAuthenticated ? (
				<div>
          <a href="/dashboard">{user.username ? user.username : user}</a>
					<br />
					{/* <Link to={"/logout"}>Logout</Link> */}
					<a href="/logout">Logout </a>
				</div>
			) : (
				<div>
					{/* <Link to={"/login"}>Logout</Link> */}
					<a href="/login">Login </a>
					<br />
					{/* <Link to={"/signup"}>Logout</Link> */}
					<a href="/register">Register</a>
				</div>
			)}
		</div>
	);
};

export default LoginStatus;
