import * as postController from "../controllers/postController"

import {FastifyPluginCallback } from "fastify"

interface postOptions {

}

const postRoutes: FastifyPluginCallback<postOptions> = (app, options, done) => {
    // Can add validator in the middle 
    app.get("/posts", postController.getAllPosts)

    app.get("/posts/:id", postController.getPost)

    done()
}

export {postRoutes} 