import { FastifyRequest, FastifyReply } from "fastify";
import { commitToDb } from "./commitToDb";
import { app, prisma } from "../app";
import { Comment } from "@prisma/client";
import { POST_FIELDS } from "./subredditController";
import { formatPostContainer } from "./utils/formatPosts";

type FastifyCallback = (
	req: FastifyRequest<{
		Params: {
			id: string;
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

// GET - /posts
export const getAllPosts: FastifyCallback = async (req, res) => {
	return await commitToDb(
		prisma.post
			.findMany({
				orderBy: {
					createdAt: "desc",
				},
				select: {
					...POST_FIELDS,
				},
			})
			.then(async (posts) => {
				return await formatPostContainer({ posts }, req, res);
			})
	);
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

// PUT - /post
export const createPost: FastifyCallback = async (req, res) => {
	if (req.body.body === "" || req.body.body == null) {
		return res.send(app.httpErrors.badRequest("Post body is required"));
	}
	if (req.body.title === null || req.body.title == "") {
		return res.send(app.httpErrors.badRequest("Post title is required"));
	}

	return await commitToDb(
		prisma.post.create({
			data: {
				title: req.body.title,
				body: req.body.body,
				userId: req.cookies.userId as string,
				subredditId: req.body.subredditId,
			},
		})
	);
};

// DELETE - /user/{id}
export const deletePost: FastifyCallback = async (req, res) => {};

// POST - /user/{id}
export const updatePost: FastifyCallback = async (req, res) => {};
