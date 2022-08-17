import { makeRequest } from "./makeRequest";

export function getSubreddits() {
    return makeRequest("/subreddits")
}