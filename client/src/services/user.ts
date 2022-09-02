import { makeRequest } from "./makeRequest";

export function signUp(name: string, email: string, password: string) {
	return makeRequest(`signup`, {
		method: "POST",
		data: { name, email, password },
	});
}

export function login(name: string, password: string) {
	return makeRequest(`login`, {
		method: "POST",
		data: { name, password },
	});
}

export function logoutUser() {
	return makeRequest(`logout`, { method: "POST" });
}

export function getUserFromCookie() {
	return makeRequest(`/user_cookie`);
}

export function getUserPageInfo(name: string) {
	return makeRequest(`/user_page/${name}`, {
		method: "GET",
	});
}

export function getUserPostsFromName(name: string) {
	return makeRequest(`/users/posts/${name}`);
}

export function getUserCommentsFromName(name: string, count: number) {
	return makeRequest(`/users/comments/${name}`);
}

export function followUser(name: string) {
	return makeRequest(`/user_follow/${name}`, {
		method: "PUT",
	});
}

export function unfollowUser(name: string) {
	return makeRequest(`/user_unfollow/${name}`, {
		method: "PUT",
	});
}

export function getFollowsAndSubscribes() {
	return makeRequest(`/user_all_follow`);
}
