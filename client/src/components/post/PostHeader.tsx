import { SubredditLink } from "components/general/SubredditLink";
import { UserLink } from "components/general/UserLink";
import React from "react";
import formatDate from "utils/formatDate";

interface PostHeaderProps {
	post: IPost;
}

export const PostHeader: React.FC<PostHeaderProps> = ({ post }) => {
	return (
		<header className="post-header">
			<SubredditLink subreddit={post.subreddit} />
			<span className="sm-info">
				Posted by <UserLink user={post.user} />{" "}
			</span>
			<div className="sm-info">{formatDate(post.createdAt)}</div>
		</header>
	);
};
