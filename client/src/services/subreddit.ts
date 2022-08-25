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

export function getSubredditDescriptionAndSubbed(name: string) {
	return makeRequest(`/subreddit/desc_sub/${name}`);
}

export function joinSubreddit(name: string) {
	return makeRequest(`/subreddit/join/${name}`, {
		method: "PUT",
	});
}

export function leaveSubreddit(name: string) {
	return makeRequest(`/subreddit/leave/${name}`, {
		method: "PUT",
	});
}
