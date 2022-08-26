import { Link } from "react-router-dom";
import React from "react";

interface UserLinkProps {
	subreddit: ISubreddit;
}

export const subredditLink = (subreddit: ISubreddit) => `/r/${subreddit.name}`;

export const SubredditLink: React.FC<UserLinkProps> = ({ subreddit }) => {
	return (
		<Link
			to={`/r/${subreddit.name}`}
			onClick={(e) => {
				e.stopPropagation();
				window.scrollTo(0, 0);
			}}
		>
			r/{subreddit.name}
		</Link>
	);
};
