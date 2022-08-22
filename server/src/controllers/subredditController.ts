import { FastifyRequest, FastifyReply } from "fastify";
import { commitToDb } from "./commitToDb";
import { app, prisma } from "../app";
import { Post, Subreddit } from "@prisma/client";

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

const POST_FIELDS = {
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
	_count: { select: { likes: true, dislikes: true } },
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
				likedByMe: 0,
			};
		}

		const likes = await prisma.user.findFirst({
			where: {
				id: req.cookies.userId,
			},
			select: {
				likedPosts: {
					where: {
						postId: {
							in: subreddit.posts.map((post: Post) => post.id),
						},
					},
					select: {
						postId: true,
					},
				},
				dislikedPosts: {
					where: {
						postId: {
							in: subreddit.posts.map((post: Post) => post.id),
						},
					},
					select: {
						postId: true,
					},
				},
			},
		});

		const likedPosts =
			likes != null ? likes.likedPosts.map((post) => post.postId) : [];
		const dislikedPosts =
			likes != null ? likes.dislikedPosts.map((post) => post.postId) : [];

		const posts = subreddit.posts.map((post: Post) => {
			if (likedPosts.includes(post.id)) {
				return { ...post, likedByMe: 1 };
			} else if (dislikedPosts.includes(post.id)) {
				return { ...post, likedByMe: -1 };
			}
			return { ...post, likedByMe: 0 };
		});

		const likedByMe = likes?.likedPosts.length
			? 1
			: likes?.dislikedPosts.length
			? -1
			: 0;

		return {
			...subreddit,
			posts,
			likedByMe,
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

		const likes = await prisma.user.findFirst({
			where: {
				id: req.cookies.userId,
			},
			select: {
				likedPosts: {
					where: {
						postId: {
							in: subreddit.posts.map((post: Post) => post.id),
						},
					},
					select: {
						postId: true,
					},
				},
				dislikedPosts: {
					where: {
						postId: {
							in: subreddit.posts.map((post: Post) => post.id),
						},
					},
					select: {
						postId: true,
					},
				},
			},
		});

		const likedPosts =
			likes != null ? likes.likedPosts.map((post) => post.postId) : [];
		const dislikedPosts =
			likes != null ? likes.dislikedPosts.map((post) => post.postId) : [];

		const posts = subreddit.posts.map((post: Post) => {
			if (likedPosts.includes(post.id)) {
				return { ...post, likedByMe: 1 };
			} else if (dislikedPosts.includes(post.id)) {
				return { ...post, likedByMe: -1 };
			}
			return { ...post, likedByMe: 0 };
		});

		const likedByMe = likes?.likedPosts.length
			? 1
			: likes?.dislikedPosts.length
			? -1
			: 0;

		return {
			...subreddit,
			posts,
			likedByMe,
		};
	});
};

// PUT - /subreddit
export const createSubreddit: FastifyCallback = async (req, res) => {};

// DELETE - /user/{id}
export const deleteSubreddit: FastifyCallback = async (req, res) => {};

// POST - /user/{id}
export const updateSubreddit: FastifyCallback = async (req, res) => {};
