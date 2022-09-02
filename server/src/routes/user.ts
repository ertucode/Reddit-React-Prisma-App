import * as userController from "../controllers/userController";

import { verifyToken } from "../verifyToken";
import { FastifyPluginCallback } from "fastify";

const userRoutes: FastifyPluginCallback = (app, options, done) => {
	// Can add validator in the middle
	app.put(
		"/users/:id",
		{ preHandler: [verifyToken] },
		userController.updateUser
	);
	app.delete(
		"/users/:id",
		{ preHandler: [verifyToken] },
		userController.deleteUser
	);

	app.get("/user_cookie", userController.getUserFromCookie);
	app.get("/users/:id", userController.getUserById);
	app.get("/user_page/:name", userController.getUserPageInfo);

	app.get("/users/posts/:name", userController.getUserPosts);
	app.get("/users/comments/:name", userController.getUserComments);
	app.get("/user_all_follow", userController.getFollowsAndSubscribes);

	app.put("/user_follow/:name", userController.followUser);
	app.put("/user_unfollow/:name", userController.unfollowUser);

	done();
};

export { userRoutes };
