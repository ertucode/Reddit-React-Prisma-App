import React, { useContext, useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { getPost } from "../services/post";
import { useMemo } from "react";

interface PostProviderProps {
	children: React.ReactNode;
}

interface IPostContext {
	post: IPost | undefined;
	getChildrenComments: (parentId: string) => IComment[];
	rootComments: IComment[];
	changeLocalComments: (action: CommentReducerAction) => void;
	toggleLocalPostLike: (
		postId: string,
		change: ToggleCommentLikeDislike
	) => void;
}

interface ToggleCommentLikeDislike {
	likeChange: -1 | 0 | 1;
	dislikeChange: -1 | 0 | 1;
}

function commentReducer(comments: IComment[], action: CommentReducerAction) {
	switch (action.type) {
		case "create":
			return [action.payload.comment, ...comments];
		case "delete":
			return comments.filter(
				(comment) => comment.id !== action.payload.commentId
			);
		case "update":
			return comments.map((comment) => {
				if (comment.id === action.payload.commentId) {
					return { ...comment, body: action.payload.body };
				}
				return comment;
			});
		case "toggle":
			const change = action.payload.change;
			return comments.map((comment) => {
				if (action.payload.commentId === comment.id) {
					const likes = comment._count.likes;
					const dislikes = comment._count.dislikes;

					comment.likedByMe =
						change.likeChange === 1
							? 1
							: change.dislikeChange === 1
							? -1
							: 0;

					return {
						...comment,
						_count: {
							likes: likes + change.likeChange,
							dislikes: dislikes + change.dislikeChange,
						},
					};
				}
				return comment;
			});
		case "set":
			return action.payload.comments;
		default:
			return comments;
	}
}

const PostContext = React.createContext<IPostContext>({
	post: undefined,
	getChildrenComments: () => [],
	rootComments: [],
	changeLocalComments: () => {},
	toggleLocalPostLike: () => {},
});

export function usePost() {
	return useContext(PostContext);
}

export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
	const { id } = useParams();
	const {
		loading,
		error,
		value: _post,
	} = useAsync<IPost>(() => getPost(id as string), [id]);

	const [comments, changeLocalComments] = useReducer(commentReducer, []);

	const [post, setPost] = useState<IPost>();

	useEffect(() => {
		setPost(_post);
	}, [_post]);

	useEffect(() => {
		if (post?.comments == null) return;
		changeLocalComments({
			type: "set",
			payload: { comments: post.comments },
		});
	}, [post?.comments]);

	function toggleLocalPostLike(
		postId: string,
		change: ToggleCommentLikeDislike
	) {
		setPost((prevPost) => {
			if (prevPost != null) {
				const likes = prevPost._count.likes;
				const dislikes = prevPost._count.dislikes;

				return {
					...prevPost,
					_count: {
						...prevPost._count,
						likes: likes + change.likeChange,
						dislikes: dislikes + change.dislikeChange,
					},
					likedByMe:
						change.likeChange === 1
							? 1
							: change.dislikeChange === 1
							? -1
							: 0,
				};
			}
			return prevPost;
		});
	}

	const commentsByParentId = useMemo(() => {
		const group: any = {};
		comments.forEach((comment) => {
			group[comment.parentId] ||= [];
			group[comment.parentId].push(comment);
		});
		return group;
	}, [comments]);

	function getChildrenComments(parentId: string) {
		return commentsByParentId[parentId];
	}

	return (
		<PostContext.Provider
			value={{
				post,
				getChildrenComments,
				rootComments: commentsByParentId["null"] || [],
				changeLocalComments,
				toggleLocalPostLike,
			}}
		>
			{loading && <h1>Loading</h1>}
			{error && <h1>Error</h1>}
			{children}
		</PostContext.Provider>
	);
};
