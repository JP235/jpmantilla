import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../api/auth/auth";

const Logout = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	return (
		<div>
			<h1>Are you sure you want to logout?</h1>
			<input
				type="button"
				value="Logout"
				onClick={() => {
					dispatch(logout());
					navigate("/");
				}}
			/>
		</div>
	);
};

export default Logout;
