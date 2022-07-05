import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Protected from "../common/utils/Protected";

import Login from "../components/auth/Login/Login";
import Logout from "../components/auth/Logout/Logout";
import Register from "../components/auth/Register/Register";
import HomePage from "../components/HomePage/HomePage";
import ListGames from "../components/ListGames/ListGames";
import PlayGame from "../components/PlayGame/PlayGame";
import UserDashboard from "../components/UserDashboard/UserDashboard";
import CustomGame from "../components/CustomGame/CustomGame";
import RandomGame from "../components/RandomGame/RandomGame";

export default function AppRoutes() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<HomePage />} exact />
				<Route path="/login" element={<Login />} exact />
				<Route path="/register" element={<Register />} exact />
				<Route path="/opengames/" element={<ListGames open={true} />} />
				<Route path="/random/*" element={<RandomGame />} />
				<Route
					path="/game/classic"
					element={<PlayGame gameCode={"classic"} />}
					exact
				/>

				<Route element={<Protected />}>
					<Route path="/custom/" element={<CustomGame />} />
					<Route path="/listgames/" element={<ListGames />} />
					<Route path="/logout" element={<Logout />} exact />
					<Route path="/game/:gameCode" element={<PlayGame />} />
					<Route path="/dashboard/*" element={<UserDashboard />} />
				</Route>
			</Routes>
		</Router>
	);
}
