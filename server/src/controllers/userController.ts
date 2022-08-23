import { FastifyRequest, FastifyReply } from "fastify";
import { commitToDb } from "./commitToDb";
import { app, prisma } from "../app";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { POST_FIELDS } from "./subredditController";
import { Post } from "@prisma/client";
import formatPosts from "./utils/formatPosts";

export type MyRequest = FastifyRequest<{
	Params: {
		id: string;
		name: string;
		tokenId: string | jwt.JwtPayload | undefined;
	};
	Body: {
		name: string;
		password: string;
		email: string;
	};
}>;

type FastifyCallback = (req: MyRequest, res: FastifyReply) => void;

// PUT -
export const updateUser: FastifyCallback = async (req, res) => {
	const userId = req.params.id;

	if (userId !== req.cookies.userId) {
		return res.send(app.httpErrors.unauthorized("Token does not match"));
	}

	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
	});

	const userWithSameName =
		req.body.name &&
		(await prisma.user.findFirst({
			where: {
				name: req.body.name,
			},
		}));
	if (userWithSameName != null) {
		return res.send(app.httpErrors.badRequest("Username already exists"));
	}

	const userWithSameEmail =
		req.body.email &&
		(await prisma.user.findFirst({
			where: {
				email: req.body.email,
			},
			select: {
				name: true,
				email: true,
			},
		}));

	if (userWithSameEmail != null) {
		return res.send(app.httpErrors.badRequest("Email already exists"));
	}

	if (req.body.password) {
		const salt = bcrypt.genSaltSync(10);
		req.body.password = bcrypt.hashSync(req.body.password, salt);
	}

	return await commitToDb(
		prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				...req.body,
			},
			select: {
				id: true,
				name: true,
				email: true,
			},
		})
	);
};
export const deleteUser: FastifyCallback = async (req, res) => {
	const userId = req.params.id;

	if (userId !== req.cookies.userId) {
		return res.send(app.httpErrors.unauthorized("Token does not match"));
	}

	return await commitToDb(
		prisma.user.delete({
			where: {
				id: userId,
			},
			select: {
				id: true,
			},
		})
	);
};

export const getUserFromCookie: FastifyCallback = async (req, res) => {
	const userId = req.cookies.userId;

	if (userId == null) {
		return res.send(app.httpErrors.badRequest("You are not logged in"));
	}

	return await commitToDb(
		prisma.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				id: true,
				name: true,
			},
		})
	);
};

const USER_SELECT = {
	select: {
		id: true,
		name: true,
		posts: {
			select: {
				...POST_FIELDS,
			},
		},
	},
};

export const getUserById: FastifyCallback = async (req, res) => {
	const userId = req.cookies.userId;

	// Implement conditional returning of some properties

	return await commitToDb(
		prisma.user.findUnique({
			where: {
				id: req.params.id,
			},
			...USER_SELECT,
		})
	);
};

export const getUserPosts: FastifyCallback = async (req, res) => {
	// const userId = req.cookies.userId;
	// Implement conditional returning of some properties

	const user = await commitToDb(
		prisma.user.findUnique({
			where: {
				name: req.params.name,
			},
			select: {
				id: true,
			},
		})
	);

	if (user == null) {
		res.send(app.httpErrors.badRequest("Username does not exist"));
	}

	return await commitToDb(
		prisma.user.findUnique({
			where: {
				name: req.params.name,
			},
			...USER_SELECT,
		})
	).then(async (user) => {
		if (user == null) {
			return res.send(app.httpErrors.badRequest("Post does not exist"));
		}

		// If no cookie early return

		const userId = req.cookies.userId;

		if (userId == null || userId === "") {
			const posts = user.posts.map((post: Post) => {
				return { ...post, likedByMe: 0 };
			});

			return {
				...user,
				posts,
			};
		}

		// const likes = await prisma.user.findFirst({
		// 	where: {
		// 		id: req.cookies.userId,
		// 	},
		// 	select: {
		// 		likedPosts: {
		// 			where: {
		// 				postId: {
		// 					in: user.posts.map((post: Post) => post.id),
		// 				},
		// 			},
		// 			select: {
		// 				postId: true,
		// 			},
		// 		},
		// 		dislikedPosts: {
		// 			where: {
		// 				postId: {
		// 					in: user.posts.map((post: Post) => post.id),
		// 				},
		// 			},
		// 			select: {
		// 				postId: true,
		// 			},
		// 		},
		// 	},
		// });

		// const posts = user.posts.map((post: Post) => {
		// 	if (
		// 		likes?.likedPosts?.find(
		// 			(likedPost) => likedPost.postId === post.id
		// 		)
		// 	) {
		// 		return { ...post, likedByMe: 1 };
		// 	} else if (
		// 		likes?.dislikedPosts?.find(
		// 			(dislikedPost) => dislikedPost.postId === post.id
		// 		)
		// 	) {
		// 		return { ...post, likedByMe: -1 };
		// 	}
		// 	return { ...post, likedByMe: 0 };
		// });

		const posts = await formatPosts(user.posts, userId);

		return {
			...user,
			posts,
		};
	});
};
