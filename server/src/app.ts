import fastify from "fastify";
import sensible from "@fastify/sensible";
import cookie from "@fastify/cookie";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import { postRoutes } from "./routes/post";
import { subredditRoutes } from "./routes/subreddit";
import { commentRoutes } from "./routes/comment";
import { likeRoutes } from "./routes/like";
import { authRoutes } from "./routes/auth";
import { userRoutes } from "./routes/user";
import { searchRoutes } from "./routes/search";

import cors from "@fastify/cors";

import { PrismaClient } from "@prisma/client";
import { getUserIdFromToken } from "./verifyToken";

declare var process: {
	env: {
		PORT: number;
		CLIENT_URL: string;
		COOKIE_SECRET: string;
		JWT_SECRET: string;
	};
};

dotenv.config();

const app = fastify();
const prisma = new PrismaClient();

app.register(cookie, { secret: process.env.COOKIE_SECRET });
// DON'T PUT ASYNC
// app.addHook("onRequest", (req, res, done) => {
// 	if (req.cookies.userId !== USER_ID) {
// 		req.cookies.userId = USER_ID;
// 		res.clearCookie("userId");
// 		res.setCookie("userId", USER_ID);
// 	}
// 	done();
// });

app.addHook("onRequest", async (req, res) => {
	const userId = getUserIdFromToken(req);
	if (userId != null) {
		req.cookies.userId = userId;
	} else {
		res.setCookie("userId", "");
	}
});

app.register(sensible);
app.register(cors, {
	origin: process.env.CLIENT_URL,
	credentials: true,
});

app.register(authRoutes);
app.register(userRoutes);
app.register(postRoutes);
app.register(subredditRoutes);
app.register(commentRoutes);
app.register(likeRoutes);
app.register(searchRoutes);

export { app };
export { prisma };

app.listen({ port: process.env.PORT });
