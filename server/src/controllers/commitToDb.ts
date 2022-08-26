import { app } from "../app";

export async function commitToDb<T>(promise: Promise<T>) {
	const [error, data]: [any, T] = await app.to(promise);

	if (error) return app.httpErrors.internalServerError(error.message); // Status code 500
	return data;
}
