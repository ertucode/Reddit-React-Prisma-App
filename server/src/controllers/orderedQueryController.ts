import { Prisma } from "@prisma/client";
import { prisma } from "../app";
import { FastifyReply, FastifyRequest } from "fastify";
import { getPosts } from "./postController";

type OrderBy = "date" | "likes" | "dislikes";

const DEFAULT_TAKE = 20;

// IN WORK

export const getInfiniteAllPostsWithOrder = async (
	req: FastifyRequest<{
		Params: {
			orderBy: OrderBy;
			cursor: null | string;
			take: string;
		};
	}>,
	res: FastifyReply
) => {
	const orderBy = req.params.orderBy;
	const cursor = req.params.cursor;
	let take = parseInt(req.params.take);

	if (isNaN(take)) {
		take = DEFAULT_TAKE;
	}

	if (cursor == null) {
		return await getPosts({ take }, req, res);
	}

	if (orderBy === "date") {
		return await getPosts(
			{ take, where: { createdAt: { lte: cursor } } },
			req,
			res
		);
	} else if (orderBy === "likes") {
	}

	await prisma.post.findMany({});
};

type a = Prisma.PostWhereInput;
