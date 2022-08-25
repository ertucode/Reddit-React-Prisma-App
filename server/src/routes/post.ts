import * as postController from "../controllers/postController";

import { FastifyPluginCallback } from "fastify";

interface postOptions {}

const postRoutes: FastifyPluginCallback<postOptions> = (app, options, done) => {
	// Can add validator in the middle

	app.get("/all_posts", postController.getAllPosts);
	app.get("/posts/homepage", postController.getHomePagePosts);
	app.get("/posts/:id", postController.getPost);

	app.post("/posts/:subredditName/post/", postController.createPost);

	done();
};

export { postRoutes };
