import React from "react";
import { useNavigate } from "react-router-dom";

export const NoUserRightSide: React.FC = () => {
	const navigate = useNavigate();

	return (
		<div className="navbar-item">
			<button
				className="secondary-btn"
				onClick={() => {
					navigate("/login");
				}}
				aria-label="login"
			>
				Login
			</button>
			<button
				className="primary-btn"
				onClick={() => {
					navigate("/sign_up");
				}}
				aria-label="sign up"
			>
				Sign up
			</button>
		</div>
	);
};
