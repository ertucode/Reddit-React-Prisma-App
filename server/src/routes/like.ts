import * as likeController from "../controllers/likeController";

import { FastifyPluginCallback } from "fastify";

interface commentOptions {}

const likeRoutes: FastifyPluginCallback<commentOptions> = (
	app,
	options,
	done
) => {
	app.post(
		"/posts/:postId/comments/:commentId/toggleLike",
		likeController.toggleCommentLike
	);

	app.post(
		"/posts/:postId/comments/:commentId/toggleDislike",
		likeController.toggleCommentDislike
	);

	app.post("/posts/:postId/toggleLike", likeController.togglePostLike);

	app.post("/posts/:postId/toggleDislike", likeController.togglePostDislike);

	done();
};

export { likeRoutes };
