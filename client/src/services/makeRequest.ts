import axios from "axios";

const api = axios.create({
	baseURL: process.env.REACT_APP_SERVER_URL,
	withCredentials: true // For cookies
})

export function makeRequest(url: string, options?: any) {
	return api(url, options)
		.then((res) => res.data)
		.catch((error) =>
			Promise.reject(error?.response?.data?.message ?? "Error")
		);
}
