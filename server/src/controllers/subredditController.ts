import { commitToDb } from "./commitToDb";
import { app, prisma } from "../app";
import { formatPostContainer } from "./utils/formatPosts";

// GET - /subreddits
export const getAllSubreddits: SubredditFastifyCallback = async (req, res) => {
	return await commitToDb(
		prisma.subreddit.findMany({
			select: {
				id: true,
				name: true,
			},
		})
	);
};

export const POST_FIELDS = {
	id: true,
	title: true,
	body: true,
	createdAt: true,
	user: {
		select: {
			id: true,
			name: true,
		},
	},
	_count: { select: { likes: true, dislikes: true, comments: true } },
	subreddit: {
		select: {
			name: true,
			id: true,
		},
	},
};

const SUBREDDIT_SELECT = {
	select: {
		id: true,
		name: true,
		posts: {
			orderBy: {
				createdAt: "desc" as const,
			},
			select: {
				...POST_FIELDS,
			},
		},
	},
};

// GET - /subreddit/{id}
export const getSubredditById: SubredditFastifyCallback = async (req, res) => {
	return await commitToDb(
		prisma.subreddit.findUnique({
			where: { id: req.params.id },
			...SUBREDDIT_SELECT,
		})
	).then(async (subreddit) => {
		return await formatPostContainer(subreddit, req, res);
	});
};

// GET - /subreddit/name/:name
export const getSubredditByName: SubredditFastifyCallback = async (
	req,
	res
) => {
	return await commitToDb(
		prisma.subreddit.findUnique({
			where: { name: req.params.name },
			...SUBREDDIT_SELECT,
		})
	).then(async (subreddit) => {
		return await formatPostContainer(subreddit, req, res);
	});
};

// PUT - /subreddit
export const createSubreddit: SubredditFastifyCallback = async (req, res) => {};

// DELETE - /user/{id}
export const deleteSubreddit: SubredditFastifyCallback = async (req, res) => {};

// POST - /user/{id}
export const updateSubreddit: SubredditFastifyCallback = async (req, res) => {};
