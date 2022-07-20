import React, { Component } from "react";
import { Navigate } from "react-router-dom";

class HomePage extends Component {

	render() {
    console.log("Home")
		return (
			<Navigate to="/opengames/" />
		);
	}
}

export default HomePage;
