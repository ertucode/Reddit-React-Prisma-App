import React from "react";
import { SearchBar } from "features/search_bar/SearchBar";
import "./styles.scss";

import { ReactComponent as RedditIcon } from "./svg/reddit-icon.svg";
import { ReactComponent as RedditName } from "./svg/reddit-name.svg";
import { ReactComponent as RedditUserIcon } from "./svg/profile.svg";
import { useUser } from "contexts/UserContext";
import { useNavigate } from "react-router-dom";

export const Navbar: React.FC = () => {
	const { currentUser } = useUser();
	const navigate = useNavigate();

	return (
		<div className="navbar-container">
			<div className="site-name navbar-item">
				<a aria-label="Home" className="app-icon-container" href="/">
					<RedditIcon style={{ width: "32px" }} />
					<RedditName />
				</a>
			</div>
			<div className="navbar-item">
				<SearchBar ariaLabel="Search site" />
			</div>
			{!currentUser ? (
				<div className="navbar-item">
					<button
						className="generic-btn-dark"
						onClick={() => {
							navigate("/login");
						}}
						aria-label="login"
					>
						Login
					</button>
					<button
						className="generic-btn"
						onClick={() => {
							navigate("/sign_up");
						}}
						aria-label="sign up"
					>
						Sign up
					</button>
				</div>
			) : (
				<div className="navbar-item">
					<button>
						<div>
							<RedditUserIcon />
						</div>
						<div>{currentUser.name}</div>
						<div>0 karma</div>
					</button>
				</div>
			)}
		</div>
	);
};
