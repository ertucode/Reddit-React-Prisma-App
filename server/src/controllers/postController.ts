import { FastifyRequest, FastifyReply } from "fastify";
import {commitToDb} from "./commitToDb"
import {app, prisma} from "../app"

type FastifyCallback = (req: FastifyRequest<{
    Params: {
        id: string
    },
    Body: {
        body: string,
        parentId: string,
        title: string,
        subredditId: string
    }
}>, res: FastifyReply) => void

// GET - /posts
export const getAllPosts: FastifyCallback = async (req, res) => {
    return await commitToDb(prisma.post.findMany({select: {
        id: true,
        title: true
    }}))
}

// GET - /user/{id}
export const getPost: FastifyCallback = async (req, res) => {
    return await commitToDb(prisma.post.findUnique({
        where: { id: req.params.id },
        select: {
            body: true,
            title: true,
            comments: {
                orderBy: {
                    createdAt: "desc"
                },
                select: {
                    id: true,
                    body: true,
                    parentId: true,
                    createdAt: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }
            }
        }
    }))
}



// PUT - /post
export const createPost: FastifyCallback = async (req, res) => {
    if (req.body.body === "" || req.body.body == null) {
        return res.send(app.httpErrors.badRequest("Post body is required"))
    }
    if (req.body.title === null || req.body.title == "") {
        return res.send(app.httpErrors.badRequest("Post title is required"))
    }

    return await commitToDb(


        prisma.post.create({
            data: {
                title: req.body.title,
                body: req.body.body,
                userId: (await prisma.user.findFirst({where: {name: "Kyle"}}))?.id || "no id",
                subredditId: req.body.subredditId,
            }
        })
    )
}

// DELETE - /user/{id}
export const deletePost: FastifyCallback = async (req, res) => {
    
}

// POST - /user/{id}
export const updatePost: FastifyCallback = async (req, res) => {
     
}