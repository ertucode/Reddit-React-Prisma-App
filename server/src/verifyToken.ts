import jwt from "jsonwebtoken";
import { FastifyRequest, FastifyReply } from "fastify";
import { app } from "./app";

export const verifyToken = (req: UserRequest, res: FastifyReply, next: any) => {
	const token = req.cookies.userToken;

	if (!token)
		return res.send(app.httpErrors.unauthorized("You are not authorized"));

	jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
		if (err)
			return res.send(app.httpErrors.unauthorized("Token is not valid"));
		req.params.tokenId = user && typeof user !== "string" && user.id;
	});
	next();
};

export const getUserIdFromToken = (req: any) => {
	const token = req?.cookies?.userToken;

	if (!token) return;

	try {
		const user = jwt.verify(token, process.env.JWT_SECRET!);
		return user && typeof user !== "string" && user.id;
	} catch (err) {
		console.log(err);
	}
};
