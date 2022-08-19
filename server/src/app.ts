import fastify from "fastify";
import sensible from "@fastify/sensible";
import cookie from "@fastify/cookie";
import dotenv from "dotenv";

import { postRoutes } from "./routes/post";
import { subredditRoutes } from "./routes/subreddit";
import { commentRoutes } from "./routes/comment";
import { likeRoutes } from "./routes/like";
import { authRoutes } from "./routes/auth";
import { userRoutes } from "./routes/user";

import cors from "@fastify/cors";

import { PrismaClient } from "@prisma/client";

declare var process: {
	env: {
		PORT: number;
		CLIENT_URL: string;
		COOKIE_SECRET: string;
	};
};

dotenv.config();

const app = fastify();
const prisma = new PrismaClient();

let USER_ID: string = "";
async function getUserId() {
	USER_ID =
		(await prisma.user.findFirst({ where: { name: "Kyle" } }))?.id ||
		"no id";
}
getUserId();

app.register(cookie, { secret: process.env.COOKIE_SECRET });
// DON'T PUT ASYNC
app.addHook("onRequest", (req, res, done) => {
	if (req.cookies.userId !== USER_ID) {
		req.cookies.userId = USER_ID;
		res.clearCookie("userId");
		res.setCookie("userId", USER_ID);
	}
	done();
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

export { app };
export { prisma };

app.listen({ port: process.env.PORT });