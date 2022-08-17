import {app} from "../app"

export async function commitToDb(promise: Promise<any>) {
    const [error, data]: [any, any] = await app.to(promise)

    if (error) return app.httpErrors.internalServerError(error.message) // Status code 500
    return data
}

