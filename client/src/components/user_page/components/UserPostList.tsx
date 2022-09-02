import { PostListWrapperWithInfiniteScroll } from "features/post_list/components/PostListWrapperWithInfiniteScroll";
import React, { useCallback } from "react";
import { getInfiniteUserPosts } from "services/infiniteScroll";

interface UserPostListProps {
	userName: string;
}

export const UserPostList: React.FC<UserPostListProps> = ({ userName }) => {
	const getter = useCallback(
		(createdAt: string | undefined) =>
			getInfiniteUserPosts(createdAt, userName),
		[userName]
	);

	return userName === "" ? (
		<div>User does not exist</div>
	) : (
		<PostListWrapperWithInfiniteScroll getter={getter} mini={true} />
	);
};
