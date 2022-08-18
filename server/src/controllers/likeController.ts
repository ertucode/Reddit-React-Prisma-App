import { FastifyRequest, FastifyReply } from "fastify";
import { commitToDb } from "./commitToDb";
import { app, prisma } from "../app";

type FastifyCallback = (
	req: FastifyRequest<{
		Params: {
			id: string;
			commentId: string;
			postId: string;
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

// POST - /posts/postId/comments/commentId/toggleLike
export const toggleCommentLike: FastifyCallback = async (req, res) => {
	const data = {
		commentId: req.params.commentId,
		userId: req.cookies.userId || "",
	};

	if (data.commentId == null) {
		return res.send(
			app.httpErrors.badRequest("You need to include a comment")
		);
	}

	if (data.userId == null) {
		return res.send(
			app.httpErrors.badRequest("You can not update someone else's like")
		);
	}

	const like = await prisma.commentLike.findUnique({
		where: { userId_commentId: data },
	});

	if (like == null) {
		const dislike = await prisma.commentDislike.findUnique({
			where: { userId_commentId: data },
		});

		let info = {};

		if (dislike != null) {
			await commitToDb(
				prisma.commentDislike.delete({
					where: {
						userId_commentId: data,
					},
				})
			);
			info = { dislikeChange: -1 };
		} else {
			info = { dislikeChange: 0 };
		}

		return await commitToDb(
			prisma.commentLike.create({ data }).then(() => {
				return { likeChange: 1, ...info };
			})
		);
	} else {
		return await commitToDb(
			prisma.commentLike
				.delete({
					where: {
						userId_commentId: data,
					},
				})
				.then(() => {
					return { likeChange: -1, dislikeChange: 0 };
				})
		);
	}
};

// POST - /posts/postId/comments/commentId/toggleDislike
export const toggleCommentDislike: FastifyCallback = async (req, res) => {
	const data = {
		commentId: req.params.commentId,
		userId: req.cookies.userId || "",
	};

	if (data.commentId == null) {
		return res.send(
			app.httpErrors.badRequest("You need to include a comment")
		);
	}

	if (data.userId == null) {
		return res.send(
			app.httpErrors.badRequest("You can not update someone else's like")
		);
	}

	const dislike = await prisma.commentDislike.findUnique({
		where: { userId_commentId: data },
	});

	if (dislike == null) {
		const like = await prisma.commentLike.findUnique({
			where: { userId_commentId: data },
		});

		let info = {};

		if (like != null) {
			await commitToDb(
				prisma.commentLike.delete({
					where: {
						userId_commentId: data,
					},
				})
			);
			info = { likeChange: -1 };
		} else {
			info = { likeChange: 0 };
		}

		return await commitToDb(
			prisma.commentDislike.create({ data }).then(() => {
				return { dislikeChange: 1, ...info };
			})
		);
	} else {
		return await commitToDb(
			prisma.commentDislike
				.delete({
					where: {
						userId_commentId: data,
					},
				})
				.then(() => {
					return { dislikeChange: -1, likeChange: 0 };
				})
		);
	}
};

// POST - /posts/postId/toggleLike
export const togglePostLike: FastifyCallback = async (req, res) => {
	const data = {
		postId: req.params.postId,
		userId: req.cookies.userId || "",
	};

	if (data.postId == null) {
		return res.send(
			app.httpErrors.badRequest("You need to include a post")
		);
	}

	if (data.userId == null) {
		return res.send(
			app.httpErrors.badRequest("You can not update someone else's like")
		);
	}

	const like = await prisma.postLike.findUnique({
		where: { userId_postId: data },
	});

	if (like == null) {
		const dislike = await prisma.postDislike.findUnique({
			where: { userId_postId: data },
		});

		let info = {};

		if (dislike != null) {
			await commitToDb(
				prisma.postDislike.delete({
					where: {
						userId_postId: data,
					},
				})
			);
			info = { dislikeChange: -1 };
		} else {
			info = { dislikeChange: 0 };
		}

		return await commitToDb(
			prisma.postLike.create({ data }).then(() => {
				return { likeChange: 1, ...info };
			})
		);
	} else {
		return await commitToDb(
			prisma.postLike
				.delete({
					where: {
						userId_postId: data,
					},
				})
				.then(() => {
					return { likeChange: -1, dislikeChange: 0 };
				})
		);
	}
};

// POST - /posts/postId/toggleDislike
export const togglePostDislike: FastifyCallback = async (req, res) => {
	const data = {
		postId: req.params.postId,
		userId: req.cookies.userId || "",
	};

	if (data.postId == null) {
		return res.send(
			app.httpErrors.badRequest("You need to include a post")
		);
	}

	if (data.userId == null) {
		return res.send(
			app.httpErrors.badRequest("You can not update someone else's like")
		);
	}

	const dislike = await prisma.postDislike.findUnique({
		where: { userId_postId: data },
	});

	if (dislike == null) {
		const like = await prisma.postLike.findUnique({
			where: { userId_postId: data },
		});

		let info = {};

		if (like != null) {
			await commitToDb(
				prisma.postLike.delete({
					where: {
						userId_postId: data,
					},
				})
			);
			info = { likeChange: -1 };
		} else {
			info = { likeChange: 0 };
		}

		return await commitToDb(
			prisma.postDislike.create({ data }).then(() => {
				return { dislikeChange: 1, ...info };
			})
		);
	} else {
		return await commitToDb(
			prisma.postDislike
				.delete({
					where: {
						userId_postId: data,
					},
				})
				.then(() => {
					return { dislikeChange: -1, likeChange: 0 };
				})
		);
	}
};
