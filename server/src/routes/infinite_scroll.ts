import * as infiniteScrollController from "../controllers/infiniteScrollController";

import { FastifyPluginCallback } from "fastify";

interface postOptions {}

const infiniteRoutes: FastifyPluginCallback<postOptions> = (
	app,
	options,
	done
) => {
	// Can add validator in the middle

	app.get(
		"/infinite/post/all_posts/:scrollIndex",
		infiniteScrollController.getInfiniteAllPosts
	);
	app.get(
		"/infinite/post/homepage/:scrollIndex",
		infiniteScrollController.getInfiniteHomePagePosts
	);
	app.get(
		"/infinite/post/user/:scrollIndex",
		infiniteScrollController.getInfiniteUserPagePosts
	);
	app.get(
		"/infinite/search/post/:query/:scrollIndex",
		infiniteScrollController.getInfinitePostSearchResult
	);
	app.get(
		"/infinite/search/comment/:query/:scrollIndex",
		infiniteScrollController.getInfiniteCommentSearchResult
	);
	app.get(
		"/infinite/search/subreddit/:query/:scrollIndex",
		infiniteScrollController.getInfiniteSubredditSearchResult
	);
	app.get(
		"/infinite/search/user/:query/:scrollIndex",
		infiniteScrollController.getInfiniteUserSearchResult
	);
	app.get(
		"/infinite/comments/:scrollIndex",
		infiniteScrollController.getInfiniteUserPageComments
	);

	done();
};

export { infiniteRoutes };
