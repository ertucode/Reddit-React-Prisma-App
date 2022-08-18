import { makeRequest } from "./makeRequest";

export function getPosts() {
    return makeRequest("/posts")
}

export function getPost(id: string) {
    return makeRequest(`/posts/${id}`)
}