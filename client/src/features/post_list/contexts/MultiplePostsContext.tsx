import React, { useContext, useEffect, useReducer } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getUserPostsFromName } from "services/user";
import { useAsync } from "../../../hooks/useAsync";
import { getSubredditByName } from "../../../services/subreddit";

interface SubredditProviderProps {
	children: React.ReactNode;
}

interface IMultiplePostsContext {
	posts: IPost[] | undefined;
	header: string;
	changeLocalPosts: (action: PostReducerAction) => void;
}

const MultiplePostsContext = React.createContext<IMultiplePostsContext>({
	posts: [],
	header: "",
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

export function useMultiplePosts() {
	return useContext(MultiplePostsContext);
}

const locationToListMap = (pathname: string) => {
	let cb;

	if (pathname.startsWith("/r/")) {
		cb = getSubredditByName;
	} else if (pathname.startsWith("/u/")) {
		cb = getUserPostsFromName;
	}

	if (!cb) {
		throw new Error("You can't use this component here");
	}

	return {
		header: pathname.slice(1),
		getter: cb,
	};
};

export const MultiplePostsProvider: React.FC<SubredditProviderProps> = ({
	children,
}) => {
	const { name } = useParams();
	const location = useLocation();

	const listParent = locationToListMap(location.pathname);

	const {
		loading,
		error,
		value: list,
	} = useAsync<ISubreddit | IUser>(
		() => listParent.getter(name as string),
		[name]
	);

	const [posts, changeLocalPosts] = useReducer(postReducer, []);

	useEffect(() => {
		console.log(list);
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
				header: listParent.header,
				changeLocalPosts,
			}}
		>
			{loading && <h1>Loading</h1>}
			{error && <h1>Error</h1>}
			{children}
		</MultiplePostsContext.Provider>
	);
};
