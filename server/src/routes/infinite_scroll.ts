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
		"/infinite/posts/all_posts/:createdAt",
		infiniteScrollController.getInfiniteAllPosts
	);
	app.get(
		"/infinite/posts/homepage/:createdAt",
		infiniteScrollController.getInfiniteHomePagePosts
	);
	app.get(
		"/infinite/posts/user/:createdAt/:userName",
		infiniteScrollController.getInfiniteUserPagePosts
	);
	app.get(
		"/infinite/search/post/:query/:createdAt",
		infiniteScrollController.getInfinitePostSearchResult
	);
	app.get(
		"/infinite/search/comment/:query/:createdAt",
		infiniteScrollController.getInfiniteCommentSearchResult
	);
	app.get(
		"/infinite/search/subreddit/:query/:createdAt",
		infiniteScrollController.getInfiniteSubredditSearchResult
	);
	app.get(
		"/infinite/search/user/:query/:createdAt",
		infiniteScrollController.getInfiniteUserSearchResult
	);
	app.get(
		"/infinite/comments/user/:createdAt/:userName",
		infiniteScrollController.getInfiniteUserPageComments
	);

	done();
};

export { infiniteRoutes };
