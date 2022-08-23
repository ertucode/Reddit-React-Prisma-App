import { SmallPost } from "./SmallPost";
import React from "react";
import "./styles.scss";

interface PostListProps {
	posts: IPost[] | undefined;
	mini?: boolean;
	changeLocalPosts: React.Dispatch<any>;
}

export const PostList: React.FC<PostListProps> = ({
	posts,
	mini = false,
	changeLocalPosts,
}) => {
	return (
		<div className="post-list">
			{posts?.map((post) => (
				<SmallPost
					key={post.id}
					post={post}
					mini={mini}
					changeLocalPosts={changeLocalPosts}
				/>
			))}
		</div>
	);
};
