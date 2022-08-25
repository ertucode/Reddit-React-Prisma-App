import React, { useState } from "react";
import "../styles/navigation-dropdown.scss";

import { ReactComponent as HomeSvg } from "../svg/home.svg";
import { ReactComponent as CarrotSvg } from "../svg/down-arrow.svg";
import { ReactComponent as AllSvg } from "../svg/all.svg";
import { useAsync } from "hooks/useAsync";
import { getFollowsAndSubscribes } from "services/user";
import { subredditLink } from "components/general/SubredditLink";
import { userLink } from "components/general/UserLink";
import { NavLink, useLocation } from "react-router-dom";

const HomeComponent = (
	<div className="svg-group">
		<HomeSvg />
		<div>Home</div>
	</div>
);

const AllComponent = (
	<div className="svg-group">
		<AllSvg />
		<div>All</div>
	</div>
);

export const NavigationDropdown: React.FC = () => {
	const { value: userSubs } = useAsync<IUser>(() =>
		getFollowsAndSubscribes()
	);

	const [open, setOpen] = useState(false);

	const onBlurEvent = (e: React.FocusEvent<HTMLDivElement, Element>) => {
		if (!e.currentTarget.contains(e.relatedTarget)) {
			setOpen(false);
		}
	};

	const onOptionPicked = () => {
		setOpen(false);
		window.scrollTo(0, 0);
	};

	const location = useLocation();

	const getComponentToRender = () => {
		const path = location.pathname;
		if (path.startsWith("/r/")) {
			return <div>{`r/${getSubredditFromPath(path)}`}</div>;
		} else if (path.startsWith("/u/")) {
			return <div>{`u/${getUserFromPath(path)}`}</div>;
		} else if (path.startsWith("/all")) {
			return AllComponent;
		} else if (path.startsWith("/search")) {
			return <div>Search</div>;
		} else {
			return HomeComponent;
		}
	};

	return (
		<div className="navigation">
			<div
				className="navigation__card"
				tabIndex={0}
				aria-label="Open navigation dropdown"
				onFocus={() => setOpen(true)}
				onBlur={onBlurEvent}
			>
				{getComponentToRender()}
				<CarrotSvg />

				<div className={`navigation__dropdown ${open ? "" : "hide"}`}>
					<div className="navigation__dropdown-group ">
						<div className="navigation__dropdown-group__title">
							Feeds
						</div>
						<NavLink
							className="navigation__dropdown-group__child"
							tabIndex={0}
							aria-label="Go to home page"
							onClick={onOptionPicked}
							to={"/"}
						>
							{HomeComponent}
						</NavLink>
						<NavLink
							className="navigation__dropdown-group__child"
							tabIndex={0}
							aria-label="Go to all posts page"
							onClick={onOptionPicked}
							to={"/all"}
						>
							{AllComponent}
						</NavLink>
					</div>
					{userSubs?.subbedTo.length ? (
						<div className="navigation__dropdown-group">
							<div className="navigation__dropdown-group__title">
								Communities
							</div>
							{userSubs.subbedTo.map((sub) => (
								<NavLink
									key={sub.name}
									className="navigation__dropdown-group__child"
									onClick={onOptionPicked}
									to={subredditLink(sub)}
									aria-label={`Go to subreddit ${sub.name}`}
									tabIndex={0}
								>
									{`r/${sub.name}`}
								</NavLink>
							))}
						</div>
					) : null}
					{userSubs?.followedUsers.length ? (
						<div className="navigation__dropdown-group">
							<div className="navigation__dropdown-group__title">
								Following
							</div>
							{userSubs.followedUsers.map((u) => (
								<NavLink
									key={u.name}
									className="navigation__dropdown-group__child"
									onClick={onOptionPicked}
									to={userLink(u)}
									aria-label={`Go to user ${u}`}
									tabIndex={0}
								>
									{`u/${u.name}`}
								</NavLink>
							))}
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
};

const USER_REGEX = /^(\/u\/)(?<username>[a-zA-Z0-9]+)(\/)*/;
const SUBREDDIT_REGEX = /^(\/r\/)(?<subreddit>[a-zA-Z0-9]+)(\/)*/;

const getUserFromPath = (path: string) => {
	return path.match(USER_REGEX)?.groups?.username;
};

const getSubredditFromPath = (path: string) => {
	return path.match(SUBREDDIT_REGEX)?.groups?.subreddit;
};
