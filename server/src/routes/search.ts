import * as searchController from "../controllers/searchController";

import { FastifyPluginCallback } from "fastify";

const searchRoutes: FastifyPluginCallback = (app, options, done) => {
	app.get("/search/all/:query/:count", searchController.searchEverything);
	app.get("/search/posts/:query/:count", searchController.searchPosts);
	app.get("/search/comments/:query/:count", searchController.searchComments);
	app.get(
		"/search/subreddits/:query/:count",
		searchController.searchSubreddits
	);
	app.get("/search/users/:query/:count", searchController.searchUsers);

	done();
};

export { searchRoutes };
