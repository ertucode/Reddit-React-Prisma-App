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

	app.get("/users/cookie", userController.getUserFromCookie);
	app.get("/users/:id", userController.getUserById);
	app.get("/users/posts/:name", userController.getUserPosts);
	app.put("/user/follow/:name", userController.followUser);
	app.put("/user/unfollow/:name", userController.unfollowUser);

	done();
};

export { userRoutes };
