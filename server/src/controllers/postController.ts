import { FastifyRequest, FastifyReply } from "fastify";
import { commitToDb } from "./commitToDb";
import { app, prisma } from "../app";
import { Comment, Prisma } from "@prisma/client";
import { POST_FIELDS } from "./subredditController";
import { formatPostContainer } from "./utils/formatPosts";
import { checkEarlyReturn } from "./utils/checkEarlyReturn";
import {
	getFollowsOfUser,
	USER_FOLLOW_WHERE_FIELDS,
} from "./utils/userHelpers";

type FastifyCallback = (
	req: FastifyRequest<{
		Params: {
			id: string;
			subredditName: string;
		};
		Body: {
			body: string;
			parentId: string;
			title: string;
			subredditId: string;
			userId: string;
		};
	}>,
	res: FastifyReply
) => void;

export const getPosts = async (
	moreOptions: Prisma.PostFindManyArgs,
	req: ContainerRequest,
	res: ContainerResponse
) => {
	return await commitToDb(
		prisma.post.findMany({
			orderBy: {
				updatedAt: "desc",
			},
			select: {
				...POST_FIELDS,
			},
			...moreOptions,
		})
	).then((posts) => formatPostContainer({ posts }, req, res));
};

// GET - /posts
export const getAllPosts: FastifyCallback = async (req, res) => {
	return getPosts({}, req, res);
};

export const getHomePagePosts: FastifyCallback = async (req, res) => {
	const userId = req.cookies.userId;

	if (checkEarlyReturn(userId)) {
		return res.send(null);
	}

	const { subIds, userIds } = await getFollowsOfUser(userId!);

	return await getPosts(USER_FOLLOW_WHERE_FIELDS(subIds, userIds), req, res);
};

const POST_COMMENT_FIELDS = {
	id: true,
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

// GET - /posts/{id}
export const getPost: FastifyCallback = async (req, res) => {
	return await commitToDb(
		prisma.post.findUnique({
			where: { id: req.params.id },
			select: {
				title: true,
				...POST_COMMENT_FIELDS,
				comments: {
					orderBy: {
						createdAt: "desc",
					},
					select: {
						parentId: true,
						...POST_COMMENT_FIELDS,
					},
				},
				subreddit: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		})
	).then(async (post) => {
		if (post == null) {
			return res.send(app.httpErrors.badRequest("Post does not exist"));
		}

		const userId = req.cookies.userId;

		if (userId == null || userId === "") {
			const comments = post.comments.map((comment: Comment) => {
				return { ...comment, likedByMe: 0 };
			});

			return {
				...post,
				comments,
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
						postId: post.id,
					},
					select: {
						postId: true,
					},
				},
				dislikedPosts: {
					where: {
						postId: post.id,
					},
					select: {
						postId: true,
					},
				},
				likedComments: {
					where: {
						commentId: {
							in: post.comments.map(
								(comment: Comment) => comment.id
							),
						},
					},
					select: {
						commentId: true,
					},
				},
				dislikedComments: {
					where: {
						commentId: {
							in: post.comments.map(
								(comment: Comment) => comment.id
							),
						},
					},
					select: {
						commentId: true,
					},
				},
			},
		});

		const likedComments =
			likes != null
				? likes.likedComments.map((comment) => comment.commentId)
				: [];
		const dislikedComments =
			likes != null
				? likes.dislikedComments.map((comment) => comment.commentId)
				: [];

		const comments = post.comments.map((comment: Comment) => {
			if (likedComments.includes(comment.id)) {
				return { ...comment, likedByMe: 1 };
			} else if (dislikedComments.includes(comment.id)) {
				return { ...comment, likedByMe: -1 };
			}
			return { ...comment, likedByMe: 0 };
		});

		const likedByMe = likes?.likedPosts.length
			? 1
			: likes?.dislikedPosts.length
			? -1
			: 0;

		return {
			...post,
			comments,
			likedByMe,
		};
	});
};

// POST - /posts/:subredditName/post
export const createPost: FastifyCallback = async (req, res) => {
	if (req.body.body === "" || req.body.body == null) {
		return res.send(app.httpErrors.badRequest("Post body is required"));
	}
	if (req.body.title === null || req.body.title == "") {
		return res.send(app.httpErrors.badRequest("Post title is required"));
	}

	const userId = req.cookies.userId;

	if (userId == null || userId != req.body.userId) {
		return res.send(
			app.httpErrors.unauthorized("You cannot create a post")
		);
	}

	const [subreddit, user] = await Promise.all([
		prisma.subreddit.findUnique({
			where: {
				name: req.params.subredditName,
			},
		}),
		prisma.user.findUnique({
			where: {
				id: userId,
			},
		}),
	]);

	if (subreddit == null || user == null) {
		return res.send(app.httpErrors.badRequest("Invalid user or subreddit"));
	}

	return await commitToDb(
		prisma.post.create({
			data: {
				title: req.body.title,
				body: req.body.body,
				userId: user.id,
				subredditId: subreddit.id,
			},
			select: {
				...POST_FIELDS,
			},
		})
	).then((post) => {
		return {
			...post,
			likedByMe: false,
			_count: { likes: 0, dislikes: 0, comments: 0 },
		};
	});
};

// DELETE - /user/{id}
export const deletePost: FastifyCallback = async (req, res) => {};

// POST - /user/{id}
export const updatePost: FastifyCallback = async (req, res) => {};
