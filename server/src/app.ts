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
import { searchRoutes } from "./routes/search";
import { infiniteRoutes } from "./routes/infinite_scroll";

import cors from "@fastify/cors";

import { PrismaClient } from "@prisma/client";
import { getUserIdFromToken } from "./verifyToken";

declare var process: {
	env: {
		PORT: number;
		SERVER_PORT: number;
		CLIENT_URL: string;
		COOKIE_SECRET: string;
		JWT_SECRET: string;
		NODE_ENV: string;
		HOST: string;
		HEROKU_POSTGRESQL_ORANGE: string;
	};
};

dotenv.config();

const app = fastify();
const prisma = new PrismaClient();

app.register(cookie, { secret: process.env.COOKIE_SECRET });

app.addHook("onRequest", async (req, res) => {
	const userId = getUserIdFromToken(req);

	if (userId != null) {
		req.cookies.userId = userId;
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
app.register(infiniteRoutes);

export { app };
export { prisma };

app.listen(
	{ host: process.env.HOST, port: process.env.PORT },
	(err, address) => {
		if (err) {
			console.error(err);
		} else {
			console.log("Server is running at ", address);
		}
	}
);
