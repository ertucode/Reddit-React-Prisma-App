import * as subredditController from "../controllers/subredditController";

import { FastifyPluginCallback } from "fastify";

interface subredditOptions {}

const subredditRoutes: FastifyPluginCallback<subredditOptions> = (
	app,
	options,
	done
) => {
	// Can add validator in the middle
	app.get("/subreddits", subredditController.getAllSubreddits);

	app.get("/subreddits/:id", subredditController.getSubredditById);
	app.get("/subreddit/:name", subredditController.getSubredditByName);
	app.get(
		"/subreddit/desc_sub/:name",
		subredditController.getSubredditDescriptionAndSubbed
	);
	app.put("/subreddit/join/:name", subredditController.joinSubreddit);
	app.put("/subreddit/leave/:name", subredditController.leaveSubreddit);

	app.post("/subreddit/create/:name", subredditController.createSubreddit);

	done();
};

export { subredditRoutes };
