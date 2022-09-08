import { FastifyRequest, FastifyReply } from "fastify";
import { commitToDb } from "./commitToDb";
import { app, prisma } from "../app";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getLikeDiff } from "./userController";
import { MAIN_USER_SELECT } from "./utils/userHelpers";

type FastifyCallback = (
	req: FastifyRequest<{
		Params: {};
		Body: {
			name: string;
			password: string;
			email: string;
		};
	}>,
	res: FastifyReply
) => void;

declare var process: {
	env: {
		JWT_SECRET: string;
		NODE_ENV: string;
	};
};

// POST - /signup
export const createUser: FastifyCallback = async (req, res) => {
	if (req.body.name === "" || req.body.name == null) {
		return res.send(app.httpErrors.badRequest("Username is required"));
	}

	const userWithSameName = await prisma.user.findUnique({
		where: {
			name: req.body.name,
		},
	});
	if (userWithSameName != null) {
		return res.send(app.httpErrors.badRequest("Username already exists"));
	}

	const userWithSameEmail = await prisma.user.findUnique({
		where: {
			email: req.body.email,
		},
	});
	if (userWithSameEmail != null) {
		return res.send(app.httpErrors.badRequest("Email already exists"));
	}

	const hash = saltPassword(req.body.password);

	return await commitToDb(
		prisma.user.create({
			data: {
				name: req.body.name,
				password: hash,
				email: req.body.email,
			},
			select: {
				id: true,
				name: true,
			},
		})
	);
};

export const loginUser: FastifyCallback = async (req, res) => {
	if (req.body.name === "" || req.body.name == null) {
		return res.send(app.httpErrors.badRequest("Username is required"));
	}

	const user = await prisma.user.findUnique({
		where: {
			name: req.body.name,
		},
		select: {
			...MAIN_USER_SELECT,
			password: true,
		},
	});

	if (user == null) {
		return res.send(app.httpErrors.badRequest("Invalid username"));
	}

	const passwordIsCorrect = await bcrypt.compare(
		req.body.password,
		user.password
	);

	if (!passwordIsCorrect) {
		return res.send(app.httpErrors.badRequest("Wrong password"));
	}

	const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

	res.setCookie("userToken", token, {
		...cookieCredentials(),
		maxAge: 1000 * 60 * 60 * 24 * 365 * 7, // 7 days
	});

	const { name } = user;

	res.send({
		id: user.id,
		name,
		karma: 2 * getLikeDiff(user.posts) + getLikeDiff(user.comments),
	});
};

export const logoutUser: FastifyCallback = async (req, res) => {
	res.setCookie("userToken", "", cookieCredentials());
};

export function saltPassword(password: string) {
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);
	return hash;
}

export const cookieCredentials = () => {
	if (process.env.NODE_ENV === "development") {
		return {
			sameSite: "none",
		} as const;
	} else {
		return { httpOnly: true, secure: true, sameSite: "none" } as const;
	}
};
