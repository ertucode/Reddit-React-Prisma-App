import { makeRequest } from "./makeRequest";

interface CommentInput {
	postId: string;
	body: string;
	parentId: string | null;
}

export function createComment({ postId, body, parentId }: CommentInput) {
	return makeRequest(`posts/${postId}/comment`, {
		method: "POST",
		data: { body, parentId },
	});
}

interface updateCommentInput {
	postId: string;
	body: string;
	commentId: string;
}

export function updateComment({ postId, body, commentId }: updateCommentInput) {
	return makeRequest(`posts/${postId}/comments/${commentId}`, {
		method: "PUT",
		data: { body },
	});
}

interface deleteCommentInput {
	postId: string;
	commentId: string;
}

export function deleteComment({ postId, commentId }: updateCommentInput) {
	return makeRequest(`posts/${postId}/comments/${commentId}`, {
		method: "DELETE",
	});
}

export type ToggleOptions = "Like" | "Dislike";

export function toggleCommentLikeDislike(
	{ postId, commentId }: deleteCommentInput,
	option: ToggleOptions
) {
	return makeRequest(
		`posts/${postId}/comments/${commentId}/toggle${option}`,
		{
			method: "POST",
		}
	);
}
