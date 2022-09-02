import React, { useCallback } from "react";
import "../styles/styles.scss";
import { getInfinitePosts } from "services/infiniteScroll";
import { PostListWrapperWithInfiniteScroll } from "features/post_list/components/PostListWrapperWithInfiniteScroll";

export const AllPage: React.FC = () => {
	const getter = useCallback(
		(createdAt: string | undefined) =>
			getInfinitePosts(createdAt, "all_posts"),
		[]
	);

	return <PostListWrapperWithInfiniteScroll getter={getter} />;
};
