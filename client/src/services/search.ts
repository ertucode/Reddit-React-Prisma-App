import { makeRequest } from "./makeRequest";

export function searchEverything(query: string, count: number) {
	return makeRequest(`search/all/${query}/${count}`);
}

export function searchPosts(query: string, count: number) {
	return makeRequest(`search/posts/${query}/${count}`);
}

export function searchComments(query: string, count: number) {
	return makeRequest(`search/comments/${query}/${count}`);
}

export function searchUsers(query: string, count: number) {
	return makeRequest(`search/users/${query}/${count}`);
}

export function searchSubreddits(query: string, count: number) {
	return makeRequest(`search/subreddits/${query}/${count}`);
}
