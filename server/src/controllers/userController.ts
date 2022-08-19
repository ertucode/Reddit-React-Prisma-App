import { FastifyRequest, FastifyReply } from "fastify";
import { commitToDb } from "./commitToDb";
import { app, prisma } from "../app";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export type MyRequest = FastifyRequest<{
	Params: {
		id: string;
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

	if (userId !== req.params.tokenId) {
		return res.send(app.httpErrors.unauthorized("Token does not match"));
	}

	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
	});

	console.log(req.body);

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

	if (userId !== req.params.tokenId) {
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
