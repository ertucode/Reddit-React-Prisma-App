import React from "react";

import "components/subreddit/styles.scss";
import { BodyHeader } from "features/body_header/BodyHeader";
import { PostListWrapper } from "features/post_list/components/PostListWrapper";
import { getSubredditByName } from "services/subreddit";
import { useParams } from "react-router-dom";
import { MockForm } from "./MockForm";

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
				<MockForm />
			</PostListWrapper>
		</>
	);
};
