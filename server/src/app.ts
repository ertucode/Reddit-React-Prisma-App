import fastify from "fastify";
import sensible from "@fastify/sensible"
import dotenv from "dotenv"

import {postRoutes} from "./routes/post";
import { subredditRoutes } from "./routes/subreddit";

import cors from "@fastify/cors"

import {PrismaClient} from "@prisma/client"


declare var process : {
    env: {
      PORT: number
      CLIENT_URL: string
    }
}

dotenv.config()

const app = fastify()
const prisma = new PrismaClient()

app.register(sensible)
app.register(cors, {
    origin: process.env.CLIENT_URL,
    credentials: true
})

app.register( postRoutes )
app.register( subredditRoutes )

export {app}
export {prisma}


app.listen({port: process.env.PORT})

