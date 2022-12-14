import React, { useMemo } from "react";
import "../styles/styles.scss";
import { NavLink, useParams } from "react-router-dom";
import { PostSearchResult } from "./PostSearchResult";
import { CommentSearchResult } from "./CommentSearchResult";
import { SubredditSearchResult } from "./SubredditSearchResult";
import { UserSearchResult } from "./UserSearchResult";

interface SearchPageProps {}

const VALID_TYPES = ["post", "comment", "subreddit", "user"];

export const SearchPage: React.FC<SearchPageProps> = () => {
	const { query = "", type = "" } = useParams();

	const ElementToDisplay = useMemo(() => {
		switch (type) {
			case "post":
				return PostSearchResult;
			case "comment":
				return CommentSearchResult;
			case "subreddit":
				return SubredditSearchResult;
			case "user":
				return UserSearchResult;
			default:
				return PostSearchResult;
		}
	}, [type]);

	return (
		<>
			<div className="page-navigation-container middle-container">
				<ul className="page-navigation">
					<li>
						<NavLink
							to={`/search/q=${query}/type=post`}
							className={`${
								VALID_TYPES.includes(type) ? "" : "active"
							}`}
						>
							Posts
						</NavLink>
					</li>
					<li>
						<NavLink to={`/search/q=${query}/type=comment`}>
							Comments
						</NavLink>
					</li>
					<li>
						<NavLink to={`/search/q=${query}/type=subreddit`}>
							Subreddits
						</NavLink>
					</li>
					<li>
						<NavLink to={`/search/q=${query}/type=user`}>
							Users
						</NavLink>
					</li>
				</ul>
			</div>
			<ElementToDisplay query={query} />
		</>
	);
};

export const NoMatch: React.FC<{ type: string }> = ({ type }) => {
	return <div>Looks like there are no {type}s that match your query</div>;
};
