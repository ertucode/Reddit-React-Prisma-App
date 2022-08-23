import { BodyHeader } from "features/body_header/BodyHeader";
import React from "react";
import { PostListWrapper } from "features/post_list/components/PostListWrapper";
import { getUserPostsFromName } from "services/user";
import { useParams } from "react-router-dom";

export const UserPage: React.FC = () => {
	const { userName } = useParams();

	// await username -> sorry nobody on reddit goes by that name

	// or this

	return (
		<>
			<BodyHeader header={`u/${userName}`} />
			<h3>POSTS</h3>
			<PostListWrapper
				getter={{ callback: getUserPostsFromName, params: [userName] }}
				mini={true}
			/>
		</>
	);
};
