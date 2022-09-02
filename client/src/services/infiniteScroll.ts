import { makeRequest } from "./makeRequest";

type PostType = "all_posts" | "homepage" | "user";

export function getInfinitePosts(
	createdAt: string | undefined,
	type: PostType
) {
	return makeRequest(`/infinite/posts/${type}/${createdAt ? createdAt : ""}`);
}

type SearchType = "post" | "comment" | "user" | "subreddit";

export function getInfiniteSearchResult(
	createdAt: string | undefined,
	type: SearchType,
	query: string
) {
	return makeRequest(
		`/infinite/search/${type}/${query}/${createdAt ? createdAt : ""}`
	);
}

export function getInfiniteUserComments(
	createdAt: string | undefined,
	userName: string
) {
	return makeRequest(
		`infinite/comments/user/${createdAt ? createdAt : ""}/${userName}`
	);
}

export function getInfiniteUserPosts(
	createdAt: string | undefined,
	userName: string
) {
	return makeRequest(
		`infinite/posts/user/${createdAt ? createdAt : ""}/${userName}`
	);
}
