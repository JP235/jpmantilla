import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
	selectIsAuthenticated,
	selectIsLoading,
} from "../api/auth/authAPISlice";

import { loadUser } from "../api/auth/auth";
import { useEffect } from "react";

const Protected = ({ children }) => {
	const dispatch = useDispatch();
	const isAuthenticated = useSelector(selectIsAuthenticated);
	const isLoading = useSelector(selectIsLoading);

	useEffect(() => {
		dispatch(loadUser());
	}, [dispatch]);

  return (
    isLoading 
      ? <div>Loading...</div> 
      : isAuthenticated ? <Outlet /> : <Navigate to="/login" />
  )
};

export default Protected;
