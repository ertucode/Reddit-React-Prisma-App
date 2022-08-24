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
	app.put("/subreddit/join/:name", subredditController.joinSubreddit);
	app.put("/subreddit/leave/:name", subredditController.leaveSubreddit);

	done();
};

export { subredditRoutes };
