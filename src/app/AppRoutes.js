import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
				<Route element={<Protected />}>
					<Route path="/custom/" element={<CustomGame />} />
					<Route path="/listgames/" element={<ListGames />} />
					<Route path="/logout" element={<Logout />} exact />
					<Route path="/game/:gameCode" element={<PlayGame />} />
					<Route path="/dashboard/*" element={<UserDashboard />} />
				</Route>
				<Route
					path="/game/classic"
					element={<PlayGame gameCode={"classic"} />}
					exact
				/>
				{/* 
					<Route path="/random/*" element={<RandomGame />} />
				 */}
			</Routes>
		</Router>
	);
}
