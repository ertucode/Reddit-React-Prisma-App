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

export function getUserFromCookie() {
	return makeRequest(`/users/cookie`, {
		method: "GET",
	});
}

export function getUserFromName(name: string) {
	return makeRequest(`/users/name/${name}`);
}
