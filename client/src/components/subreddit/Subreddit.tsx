import React from "react";
import { useSubreddit } from "contexts/SubredditContext";

import "components/subreddit/styles.scss";
import { SmallPost } from "./SmallPost";

interface SubredditProps {}

export const Subreddit: React.FC<SubredditProps> = () => {
	const { name: subredditName, posts, id: subredditId } = useSubreddit();

	return subredditId ? (
		<>
			<h1>{subredditName}</h1>
			<div className="post-list">
				{posts?.map((post) => (
					<SmallPost key={post.id} post={post} />
				))}
			</div>
		</>
	) : null;
};
