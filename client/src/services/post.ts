import { ToggleOptions } from "./comment";
import { makeRequest } from "./makeRequest";

export function getPosts() {
	return makeRequest("/all_posts");
}

export function getPost(id: string) {
	return makeRequest(`/posts/${id}`);
}

export function togglePostLikeDislike(postId: string, option: ToggleOptions) {
	return makeRequest(`posts/${postId}/toggle${option}`, {
		method: "POST",
	});
}
