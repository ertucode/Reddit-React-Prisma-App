import { useInfiniteScroll } from "features/infinite_scrolling/hooks/useInfiniteScroll";
import filterListById from "features/search_page/utils/filterListById";
import React, { useContext, useReducer, useCallback } from "react";
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
		case "push":
			return [...posts, ...action.payload.posts];
		case "set":
			return action.payload.posts;
		default:
			return posts;
	}
}

interface PostListWrapperProps {
	mini?: boolean;
	getter: any;
	children?: React.ReactNode;
}

export function useMultiplePosts() {
	return useContext(MultiplePostsContext);
}

export const PostListWrapperWithInfiniteScroll: React.FC<
	PostListWrapperProps
> = ({ mini = false, getter, children }) => {
	const [posts, changeLocalPosts] = useReducer(postReducer, []);

	const getter_ = useCallback(
		() => getter(posts?.at(-1)?.createdAt?.toString()),
		[getter, posts]
	);

	const setter = useCallback(
		(data: { posts: IPost[] }) => {
			if (data == null || data.posts.length === 0) {
				return true;
			}
			const newList = filterListById(posts, data.posts);

			if (posts.length !== 0 && newList.length === 0) {
				return true;
			}

			changeLocalPosts({ type: "push", payload: { posts: newList } });
			return false;
		},
		// eslint-disable-next-line
		[posts, changeLocalPosts]
	);

	const { loading, error, LastDiv } = useInfiniteScroll(getter_, setter);

	return (
		<MultiplePostsContext.Provider
			value={{
				posts,
				changeLocalPosts,
			}}
		>
			{children}
			<PostList
				posts={posts}
				mini={mini}
				changeLocalPosts={changeLocalPosts}
				loading={loading}
				error={error}
			/>
			{LastDiv}
		</MultiplePostsContext.Provider>
	);
};
