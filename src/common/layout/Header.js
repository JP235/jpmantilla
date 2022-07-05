import "./Header.css"

import React from "react";

import Navbar from "./Navbar";
import LoginStatus from "../../components/auth/LoginStatus";

const Header = () => {
	return (
    <div className="Header">
    <LoginStatus/>
    <Navbar/>
    </div>
	);
};

export default Header;
  