import { Link } from "react-router-dom";
import React from "react";

interface UserLinkProps {
	subreddit: ISubreddit;
}

export const SubredditLink: React.FC<UserLinkProps> = ({ subreddit }) => {
	return <Link to={`/r/${subreddit.name}`}>r/{subreddit.name}</Link>;
};
