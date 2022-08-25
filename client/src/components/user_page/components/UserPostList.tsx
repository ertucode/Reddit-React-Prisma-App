import { PostListWrapper } from "features/post_list/components/PostListWrapper";
import React from "react";
import { getUserPostsFromName } from "services/user";

interface UserPostListProps {
	userName: string | undefined;
}

export const UserPostList: React.FC<UserPostListProps> = ({ userName }) => {
	if (userName == null) return <div>User does not exist</div>;

	return (
		<PostListWrapper
			getter={{
				callback: getUserPostsFromName,
				params: [userName],
			}}
			mini={true}
		/>
	);
};
