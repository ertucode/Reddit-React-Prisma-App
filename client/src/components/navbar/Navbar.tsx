import React from "react";
import { SearchBar } from "features/search_bar/SearchBar";
import "./styles.scss";

import { ReactComponent as RedditIcon } from "./svg/reddit-icon.svg";
import { ReactComponent as RedditName } from "./svg/reddit-name.svg";
import { ReactComponent as RedditUserIcon } from "./svg/reddit-profile.svg";
import { ReactComponent as GenericProfileIcon } from "./svg/generic-profile.svg";
import { ReactComponent as LogoutIcon } from "./svg/logout.svg";
import { useUser } from "contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useAsyncFn } from "hooks/useAsync";
import { logoutUser } from "services/user";

export const Navbar: React.FC = () => {
	const { currentUser, changeCurrentUser } = useUser();
	const navigate = useNavigate();

	const { execute: logout } = useAsyncFn(logoutUser);

	function onLogout() {
		logout().then(() => {
			changeCurrentUser({ type: "logout" });
		});
	}

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
				<div className="navbar-item user-card expanded">
					<button className="user-card__button">
						<div>
							<RedditUserIcon />
						</div>
						<div>{currentUser.name}</div>
						<div>0 karma</div>
					</button>
					<div className="dropdown HIDE">
						<button className="dropdown__button">
							<GenericProfileIcon />
							<div>Profile</div>
						</button>
						<button className="dropdown__button" onClick={onLogout}>
							<LogoutIcon fill="currentcolor" />
							<div>Logout</div>
						</button>
					</div>
				</div>
			)}
		</div>
	);
};
