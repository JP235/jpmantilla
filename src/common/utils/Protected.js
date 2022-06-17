import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
	selectIsAuthenticated,
	selectIsLoading,
} from "../../api/auth/authAPISlice";

import { loadUser } from "../../api/auth/auth";
import { useEffect } from "react";

const Protected = ({ children }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const isAuthenticated = useSelector(selectIsAuthenticated);
	const isLoading = useSelector(selectIsLoading);

	useEffect(() => {
		dispatch(loadUser());
	}, [dispatch]);

	useEffect(() => {
		if (!isAuthenticated && !isLoading) {
			navigate("/login");
		}
	}, [navigate, isAuthenticated, isLoading]);

	if (isAuthenticated) {
		return children;
	} else if (!isLoading) {
		console.log("Not authenticated");
	}
};

export default Protected;
