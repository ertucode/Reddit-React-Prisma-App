import { makeRequest } from "./makeRequest";

type PostType = "all_posts" | "homepage" | "user";

export function getInfinitePosts(scrollIndex: string, type: PostType) {
	return makeRequest(
		`/infinite/post/${type}/${scrollIndex ? scrollIndex : ""}`
	);
}

type SearchType = "post" | "comment" | "user" | "subreddit";

export function getInfiniteSearchResult(
	scrollIndex: string,
	type: SearchType,
	query: string
) {
	return makeRequest(
		`/infinite/search/${type}/${query}/${scrollIndex ? scrollIndex : ""}`
	);
}

export function getInfiniteUserComments(scrollIndex: string) {
	return makeRequest(`infinite/comments/${scrollIndex ? scrollIndex : ""}`);
}
