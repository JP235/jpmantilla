import "./App.css";

import React from "react";

import Header from "../common/layout/Header";
import Footer from "../common/layout/Footer";
import AppRoutes from "./AppRoutes";

function App() {
	return (
		<>
			<Header />
			<div className="Content">
				<AppRoutes />
			</div>
			{/* <Footer /> */}
		</>
	);
}

export default App;
