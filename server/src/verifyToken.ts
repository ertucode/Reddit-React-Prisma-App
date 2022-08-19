import jwt from "jsonwebtoken";
import { MyRequest } from "./controllers/userController";
import { FastifyRequest, FastifyReply } from "fastify";
import { app } from "./app";

export const verifyToken = (req: MyRequest, res: FastifyReply, next: any) => {
	const token = req.cookies.userToken;

	if (!token)
		return res.send(app.httpErrors.unauthorized("You are not authorized"));

	jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
		if (err)
			return res.send(app.httpErrors.unauthorized("Token is not valid"));
		req.params.tokenId = user && typeof user !== "string" && user.id;
	});
	next();
};
