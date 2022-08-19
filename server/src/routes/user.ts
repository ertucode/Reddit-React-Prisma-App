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
	app.get("/users/:id", userController.getUser);

	done();
};

export { userRoutes };
