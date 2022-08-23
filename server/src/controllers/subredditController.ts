import { FastifyRequest, FastifyReply } from "fastify";
import { commitToDb } from "./commitToDb";
import { app, prisma } from "../app";
import { Post, Subreddit } from "@prisma/client";
import formatPosts from "./utils/formatPosts";

type FastifyCallback = (
	req: FastifyRequest<{
		Params: {
			id: string;
			name: string;
		};
		Body: {
			body: string;
			parentId: string;
			title: string;
			subredditId: string;
		};
	}>,
	res: FastifyReply
) => void;

// GET - /subreddits
export const getAllSubreddits: FastifyCallback = async (req, res) => {
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

// GET - /subreddit/{id}
export const getSubredditById: FastifyCallback = async (req, res) => {
	return await commitToDb(
		prisma.subreddit.findUnique({
			where: { id: req.params.id },
			select: {
				id: true,
				name: true,
				posts: {
					orderBy: {
						createdAt: "desc",
					},
					select: {
						...POST_FIELDS,
					},
				},
			},
		})
	).then(async (subreddit) => {
		if (subreddit == null) {
			return res.send(app.httpErrors.badRequest("Post does not exist"));
		}

		// If no cookie early return

		const userId = req.cookies.userId;

		if (userId == null || userId === "") {
			const posts = subreddit.posts.map((post: Post) => {
				return { ...post, likedByMe: 0 };
			});

			return {
				...subreddit,
				posts,
			};
		}

		const posts = await formatPosts(subreddit.posts, userId);

		return {
			...subreddit,
			posts,
		};
	});
};

// GET - /subreddit/name/:name
export const getSubredditByName: FastifyCallback = async (req, res) => {
	return await commitToDb(
		prisma.subreddit.findUnique({
			where: { name: req.params.name },
			select: {
				id: true,
				name: true,
				posts: {
					orderBy: {
						createdAt: "desc",
					},
					select: {
						...POST_FIELDS,
					},
				},
			},
		})
	).then(async (subreddit) => {
		if (subreddit == null) {
			return res.send(app.httpErrors.badRequest("Post does not exist"));
		}

		// If no cookie early return

		const userId = req.cookies.userId;

		if (userId == null || userId === "") {
			const posts = subreddit.posts.map((post: Post) => {
				return { ...post, likedByMe: 0 };
			});

			return {
				...subreddit,
				posts,
				likedByMe: 0,
			};
		}

		const posts = await formatPosts(subreddit.posts, userId);

		return {
			...subreddit,
			posts,
		};
	});
};

// PUT - /subreddit
export const createSubreddit: FastifyCallback = async (req, res) => {};

// DELETE - /user/{id}
export const deleteSubreddit: FastifyCallback = async (req, res) => {};

// POST - /user/{id}
export const updateSubreddit: FastifyCallback = async (req, res) => {};
