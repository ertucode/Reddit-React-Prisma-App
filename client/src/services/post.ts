import { ToggleOptions } from "./comment";
import { makeRequest } from "./makeRequest";

export function getPosts() {
	return makeRequest("/all_posts");
}

export function getPost(id: string) {
	return makeRequest(`/posts/${id}`);
}

export function getHomePagePosts() {
	return makeRequest(`/posts/homepage`);
}

export function togglePostLikeDislike(postId: string, option: ToggleOptions) {
	return makeRequest(`posts/${postId}/toggle${option}`, {
		method: "POST",
	});
}

export function createPost(
	subredditId: string,
	userId: string,
	title: string,
	body: string
) {
	return makeRequest(`posts/${subredditId}/post/`, {
		method: "POST",
		data: { body, title, userId },
	});
}
