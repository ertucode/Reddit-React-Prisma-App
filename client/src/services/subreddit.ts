import { makeRequest } from "./makeRequest";

export function getSubreddits() {
	return makeRequest("/subreddits");
}

export function getSubreddit(id: string) {
	return makeRequest(`/subreddits/${id}`);
}

export function getSubredditByName(name: string) {
	return makeRequest(`/subreddit/${name}`);
}
