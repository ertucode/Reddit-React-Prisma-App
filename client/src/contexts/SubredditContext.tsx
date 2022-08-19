import React, { useContext, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { getSubreddit } from "../services/subreddit";

interface SubredditProviderProps {
	children: React.ReactNode;
}

interface ISubredditContext {
	posts: IPost[] | undefined;
	name: string | undefined;
	id: string | undefined;
	changeLocalPosts: (action: PostReducerAction) => void;
}

const SubredditContext = React.createContext<ISubredditContext>({
	posts: [],
	name: "",
	id: "",
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

export function useSubreddit() {
	return useContext(SubredditContext);
}

export const SubredditProvider: React.FC<SubredditProviderProps> = ({
	children,
}) => {
	const { id } = useParams();
	const {
		loading,
		error,
		value: subreddit,
	} = useAsync<ISubreddit>(() => getSubreddit(id as string), [id]);

	const [posts, changeLocalPosts] = useReducer(postReducer, []);

	useEffect(() => {
		if (subreddit?.posts == null) return;
		changeLocalPosts({
			type: "set",
			payload: { posts: subreddit.posts },
		});
	}, [subreddit?.posts]);

	return (
		<SubredditContext.Provider
			value={{
				name: subreddit?.name,
				posts,
				id: subreddit?.id,
				changeLocalPosts,
			}}
		>
			{loading && <h1>Loading</h1>}
			{error && <h1>Error</h1>}
			{children}
		</SubredditContext.Provider>
	);
};
