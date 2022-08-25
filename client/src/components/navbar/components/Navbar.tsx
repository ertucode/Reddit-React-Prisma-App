import React from "react";
import { SearchBar } from "features/search_bar/SearchBar";
import "../styles/navbar.scss";

import { ReactComponent as RedditIcon } from "../svg/reddit-icon.svg";
import { ReactComponent as RedditName } from "../svg/reddit-name.svg";
import { useUser } from "contexts/UserContext";
import { NavigationDropdown } from "./NavigationDropdown";
import { NavbarUserCard } from "./NavbarUserCard";
import { NoUserRightSide } from "./NoUserRightSide";

export const Navbar: React.FC = () => {
	const { currentUser, loading: userLoading } = useUser();

	return (
		<div className="navbar-container">
			<div className="site-name navbar-item">
				<a
					aria-label="Home"
					className="app-icon-container"
					href={currentUser ? "/" : "/all"}
				>
					<RedditIcon style={{ width: "32px" }} />
					<RedditName />
				</a>
			</div>
			<NavigationDropdown />
			<div className="navbar-item">
				<SearchBar ariaLabel="Search site" />
			</div>
			{!userLoading &&
				(!currentUser ? <NoUserRightSide /> : <NavbarUserCard />)}
		</div>
	);
};
