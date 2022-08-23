import React, { useEffect, useReducer } from "react";
import { useAsync } from "../../../hooks/useAsync";
import { PostList } from "./PostList";

interface IMultiplePostsContext {
	posts: IPost[] | undefined;
	changeLocalPosts: (action: PostReducerAction) => void;
}

const MultiplePostsContext = React.createContext<IMultiplePostsContext>({
	posts: [],
	changeLocalPosts: () => {},
});

function postReducer(posts: IPost[], action: PostReducerAction) {
	switch (action.type) {
		case "create":
			return [action.payload.post, ...posts];
		case "delete":
			return posts.filter((post) => post.id !== action.payload.postId);
		case "update":
			return posts.map((post) => {
				if (post.id === action.payload.postId) {
					return { ...post, body: action.payload.body };
				}
				return post;
			});
		case "toggle":
			const change = action.payload.change;
			return posts.map((post) => {
				if (action.payload.postId === post.id) {
					const likes = post._count.likes;
					const dislikes = post._count.dislikes;

					post.likedByMe =
						change.likeChange === 1
							? 1
							: change.dislikeChange === 1
							? -1
							: 0;

					return {
						...post,
						_count: {
							...post._count,
							likes: likes + change.likeChange,
							dislikes: dislikes + change.dislikeChange,
						},
					};
				}
				return post;
			});
		case "set":
			return action.payload.posts;
		default:
			return posts;
	}
}

interface PostListWrapperProps {
	mini?: boolean;
	getter: any;
}

export const PostListWrapper: React.FC<PostListWrapperProps> = ({
	mini = false,
	getter,
}) => {
	const {
		loading,
		error,
		value: list,
	} = useAsync<ISubreddit | IUser>(
		() => getter.callback(...getter.params),
		getter.params
	);

	const [posts, changeLocalPosts] = useReducer(postReducer, []);

	useEffect(() => {
		if (list?.posts == null) return;
		changeLocalPosts({
			type: "set",
			payload: {
				posts: list.posts,
			},
		});
	}, [list?.posts, list]);

	return (
		<MultiplePostsContext.Provider
			value={{
				posts,
				changeLocalPosts,
			}}
		>
			<PostList
				posts={posts}
				mini={mini}
				changeLocalPosts={changeLocalPosts}
				loading={loading}
				error={error}
			/>
		</MultiplePostsContext.Provider>
	);
};
