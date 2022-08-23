import * as authController from "../controllers/authController";

import { FastifyPluginCallback } from "fastify";

const authRoutes: FastifyPluginCallback = (app, options, done) => {
	// Can add validator in the middle
	app.post("/signup", authController.createUser);

	app.post("/login", authController.loginUser);

	app.post("/logout", authController.logoutUser);

	done();
};

export { authRoutes };
