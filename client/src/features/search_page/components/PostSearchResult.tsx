import { PostListWrapper } from "features/post_list/components/PostListWrapper";
import React from "react";
import { searchPosts } from "services/search";

interface PostSearchResultProps {
	query: string;
}

export const PostSearchResult: React.FC<PostSearchResultProps> = ({
	query,
}) => {
	return (
		<PostListWrapper
			getter={{ callback: searchPosts, params: [query, 20] }}
		/>
	);
};
