import React from "react";
import { useSubreddit } from "contexts/SubredditContext";

import "components/subreddit/styles.scss";
import { SmallPost } from "./SmallPost";

interface SubredditProps {}

export const Subreddit: React.FC<SubredditProps> = () => {
	const { subreddit, posts } = useSubreddit();

	return subreddit ? (
		<>
			<div className="subreddit-header">
				<div>
					<h1>r/{subreddit.name}</h1>
				</div>
			</div>
			<div className="post-list">
				{posts?.map((post) => (
					<SmallPost key={post.id} post={post} />
				))}
			</div>
		</>
	) : null;
};
