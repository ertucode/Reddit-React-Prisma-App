import React from "react";
import { useSubreddit } from "contexts/MultiplePostsContext";

import "components/subreddit/styles.scss";
import { SmallPost } from "./SmallPost";
import { useParams } from "react-router-dom";

interface SubredditProps {}

export const Subreddit: React.FC<SubredditProps> = () => {
	const { posts } = useSubreddit();

	const { name } = useParams();

	return (
		<>
			<div className="subreddit-header">
				<div>
					<h1>r/{name}</h1>
				</div>
			</div>
			<div className="post-list">
				{posts?.map((post) => (
					<SmallPost key={post.id} post={post} />
				))}
			</div>
		</>
	);
};
