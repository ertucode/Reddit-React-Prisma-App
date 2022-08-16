import fastify from "fastify";
import sensible from "@fastify/sensible"
import dotenv from "dotenv"
import {PrismaClient} from "@prisma/client"

dotenv.config()

const app = fastify()
app.register(sensible)

declare var process : {
	env: {
	  PORT: number
	}
}

const prisma = new PrismaClient()

app.get("/posts", async (req, res) => {
    return await commitToDb(prisma.post.findMany({select: {
        id: true,
        title: true
    }}))
})

async function commitToDb(promise: Promise<any>) {
    const [error, data]: [any, any] = await app.to(promise)

    if (error) return app.httpErrors.internalServerError(error.message) // Status code 500
    return data
}

app.listen({port: process.env.PORT})