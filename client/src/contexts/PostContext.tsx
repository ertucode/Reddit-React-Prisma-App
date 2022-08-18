import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { getPost } from "../services/posts";
import { IComment, IPost } from "../interfaces";
import { useMemo } from "react";

interface PostProviderProps {
	children: React.ReactNode;
}

interface IPostContext {
	post: IPost | undefined;
	getChildrenComments: (parentId: string) => IComment[];
	rootComments: IComment[];
	createLocalComment: (comment: IComment) => void;
	updateLocalComment: (commentId: string, body: string) => void;
	deleteLocalComment: (commentId: string) => void;
	toggleLocalCommentLike: (
		commentId: string,
		change: ToggleCommentLikeDislike
	) => void;
	toggleLocalPostLike: (
		postId: string,
		change: ToggleCommentLikeDislike
	) => void;
}

interface ToggleCommentLikeDislike {
	likeChange: -1 | 0 | 1;
	dislikeChange: -1 | 0 | 1;
}

const PostContext = React.createContext<IPostContext>({
	post: undefined,
	getChildrenComments: () => [],
	rootComments: [],
	createLocalComment: () => {},
	updateLocalComment: () => {},
	deleteLocalComment: () => {},
	toggleLocalCommentLike: () => {},
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

	const [comments, setComments] = useState<IComment[]>([]);
	const [post, setPost] = useState<IPost>();

	useEffect(() => {
		setPost(_post);
	}, [_post]);

	useEffect(() => {
		if (post?.comments == null) return;
		setComments(post.comments);
	}, [post?.comments]);

	function createLocalComment(comment: IComment) {
		setComments((prev) => [comment, ...prev]);
	}
	function updateLocalComment(commentId: string, body: string) {
		setComments((prevComments) => {
			return prevComments.map((comment) => {
				if (comment.id === commentId) {
					return { ...comment, body };
				}
				return comment;
			});
		});
	}

	function deleteLocalComment(commentId: string) {
		setComments((prevComments) =>
			prevComments.filter((comment) => comment.id !== commentId)
		);
	}

	function toggleLocalCommentLike(
		commentId: string,
		change: ToggleCommentLikeDislike
	) {
		setComments((prevComments) => {
			return prevComments.map((comment) => {
				if (commentId === comment.id) {
					const likes = comment._count.likes;
					const dislikes = comment._count.dislikes;

					return {
						...comment,
						_count: {
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
				return comment;
			});
		});
	}

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
				createLocalComment,
				updateLocalComment,
				deleteLocalComment,
				toggleLocalCommentLike,
				toggleLocalPostLike,
			}}
		>
			{loading && <h1>Loading</h1>}
			{error && <h1>Error</h1>}
			{children}
		</PostContext.Provider>
	);
};
