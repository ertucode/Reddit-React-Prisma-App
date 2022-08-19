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

	done();
};

export { userRoutes };
