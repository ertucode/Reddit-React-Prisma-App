import React from "react";

import "components/subreddit/styles.scss";
import { BodyHeader } from "features/body_header/BodyHeader";
import {
	PostListWrapper,
	useMultiplePosts,
} from "features/post_list/components/PostListWrapper";
import { getSubredditByName } from "services/subreddit";
import { useParams } from "react-router-dom";
import { PostForm } from "./PostForm";
import { createPost } from "services/post";
import { useAsyncFn } from "hooks/useAsync";
import { useUser } from "contexts/UserContext";

interface SubredditProps {}

export const Subreddit: React.FC<SubredditProps> = () => {
	const { subredditName } = useParams();

	return (
		<>
			<BodyHeader header={`r/${subredditName}`} />
			<PostListWrapper
				getter={{
					callback: getSubredditByName,
					params: [subredditName],
				}}
			>
				<PostForm />
			</PostListWrapper>
		</>
	);
};
