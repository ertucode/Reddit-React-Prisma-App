import * as commentController from "../controllers/commentController";

import { FastifyPluginCallback } from "fastify";

interface commentOptions {}

const commentRoutes: FastifyPluginCallback<commentOptions> = (
	app,
	options,
	done
) => {
	// Can add validator in the middle
	app.post("/posts/:id/comment", commentController.postComment);

	app.put(
		"/posts/:postId/comments/:commentId",
		commentController.updateComment
	);
	app.delete(
		"/posts/:postId/comments/:commentId",
		commentController.deleteComment
	);

	done();
};

export { commentRoutes };
