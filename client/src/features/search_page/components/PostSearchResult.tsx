import { PostListWrapperWithInfiniteScroll } from "features/post_list/components/PostListWrapperWithInfiniteScroll";
import React, { useCallback } from "react";
import { getInfiniteSearchResult } from "services/infiniteScroll";

interface PostSearchResultProps {
	query: string;
}

export const PostSearchResult: React.FC<PostSearchResultProps> = ({
	query,
}) => {
	const getter = useCallback(
		(createdAt: string | undefined) =>
			getInfiniteSearchResult(createdAt, "post", query),
		[query]
	);

	return <PostListWrapperWithInfiniteScroll getter={getter} />;
};
