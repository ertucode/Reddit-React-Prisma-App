import { FastifyRequest, FastifyReply } from "fastify";
import { commitToDb } from "./commitToDb";
import { app, prisma } from "../app";
import { checkEarlyReturn } from "./utils/checkEarlyReturn";

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

// POST - /posts/post{id}/comment
export const postComment: FastifyCallback = async (req, res) => {
	if (req.body.body === "" || req.body.body == null) {
		return res.send(app.httpErrors.badRequest("Message is required"));
	}

	const userId = req.cookies.userId;

	if (checkEarlyReturn(userId)) {
		return res.send(app.httpErrors.badRequest("You are not logged in"));
	}

	return await commitToDb(
		prisma.comment.create({
			data: {
				body: req.body.body,
				userId: userId!,
				parentId: req.body.parentId,
				postId: req.params.id,
			},
			select: {
				id: true,
				body: true,
				parentId: true,
				createdAt: true,
				user: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		})
	).then((comment) => {
		return {
			...comment,
			likedByMe: false,
			_count: { likes: 0, dislikes: 0 },
		};
	});
};

// PUT  - /posts/postId/comments/commendId
export const updateComment: FastifyCallback = async (req, res) => {
	if (req.body.body === "" || req.body.body == null) {
		return res.send(app.httpErrors.badRequest("Message is required"));
	}

	const user = await prisma.comment.findUnique({
		where: {
			id: req.params.commentId,
		},
		select: {
			userId: true,
		},
	});

	if (user == null) {
		return res.send(app.httpErrors.badRequest("Comment does not exist"));
	}

	if (user.userId !== req.cookies.userId) {
		return res.send(
			app.httpErrors.unauthorized(
				"You can not change someone else's comment"
			)
		);
	}

	return await commitToDb(
		prisma.comment.update({
			where: {
				id: req.params.commentId,
			},
			data: {
				body: req.body.body,
			},
			select: {
				body: true,
			},
		})
	);
};

// DELETE  - /posts/postId/comments/commendId
export const deleteComment: FastifyCallback = async (req, res) => {
	const user = await prisma.comment.findUnique({
		where: {
			id: req.params.commentId,
		},
		select: {
			userId: true,
		},
	});

	if (user == null) {
		return res.send(app.httpErrors.badRequest("Comment does not exist"));
	}

	if (user.userId !== req.cookies.userId) {
		return res.send(
			app.httpErrors.unauthorized(
				"You can not delete someone else's comment"
			)
		);
	}

	return await commitToDb(
		prisma.comment.delete({
			where: {
				id: req.params.commentId,
			},
			select: {
				id: true,
			},
		})
	);
};
