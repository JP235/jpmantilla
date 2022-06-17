import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
} from "react-router-dom";

import Protected from "../common/utils/Protected";

import Login from "../pages/auth/Login/Login";
import Logout from "../pages/auth/Logout/Logout";
import Register from "../pages/auth/Register/Register";
import HomePage from "../pages/HomePage/HomePage";
import ListGames from "../pages/ListGames/ListGames";
import PlayGame from "../pages/PlayGame/PlayGame";
import UserDashboard from "../pages/UserDashboard/UserDashboard";
import CustomGame from "../pages/CustomGame/CustomGame";

export default function AppRoutes() {


	return (
		<Router>
			<Routes>
				<Route path="/" element={<HomePage />} exact />
				<Route path="/login" element={<Login />} exact />
				<Route path="/register" element={<Register />} exact />
				<Route
					path="/custom/"
					element={
						<Protected>
							<CustomGame />
						</Protected>
					}
				/>
				<Route
					path="/listgames/"
					element={
						<Protected>
							<ListGames />
						</Protected>
					}
				/>
				<Route
					path="/logout"
					element={
						<Protected>
							<Logout />
						</Protected>
					}
					exact
				/>
				<Route
					path="/game/:gameCode"
					element={
						<Protected>
							<PlayGame />
						</Protected>
					}
				/>
				<Route
					path="/game/classic"
					element={
							<PlayGame gameCode={"classic"} />
					} exact
				/>
				<Route
					path="/dashboard/*"
					element={
						<Protected>
							<UserDashboard />
						</Protected>
					}
				/>
				{/* 
					<Route path="/random/*" element={<RandomGame />} />
				 */}
			</Routes>
		</Router>
	);
}
