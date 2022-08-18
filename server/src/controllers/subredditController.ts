import { FastifyRequest, FastifyReply } from "fastify";
import {commitToDb} from "./commitToDb"
import { prisma} from "../app"

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

// GET - /subreddits
export const getAllSubreddits: FastifyCallback = async (req, res) => {
    return await commitToDb(prisma.subreddit.findMany({select: {
        id: true,
        name: true
    }}))
}

// GET - /subreddit/{id}
export const getSubreddit: FastifyCallback = async (req, res) => {
    return await commitToDb(prisma.subreddit.findUnique({
        where: { id: req.params.id },
        select: {
            id: true,
            name: true,
            posts: {
                orderBy: {
                    createdAt: "desc"
                },
                select: {
                    id: true,
                    title: true,
                    body: true,
                    createdAt: true,
                    likes: true,
                    dislikes: true,
                    user: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            }
        }
    }))
}

// PUT - /subreddit
export const createSubreddit: FastifyCallback = async (req, res) => {
    
}

// DELETE - /user/{id}
export const deleteSubreddit: FastifyCallback = async (req, res) => {
    
}

// POST - /user/{id}
export const updateSubreddit: FastifyCallback = async (req, res) => {
     
}