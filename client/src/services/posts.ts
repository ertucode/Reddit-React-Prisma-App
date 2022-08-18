import { ToggleOptions } from "./comments";
import { makeRequest } from "./makeRequest";

export function getPosts() {
	return makeRequest("/posts");
}

export function getPost(id: string) {
	return makeRequest(`/posts/${id}`);
}

export function togglePostLikeDislike(postId: string, option: ToggleOptions) {
	return makeRequest(`posts/${postId}/toggle${option}`, {
		method: "POST",
	});
}
