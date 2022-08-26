import { Prisma } from "@prisma/client";
import { prisma } from "../../app";
import { commitToDb } from "../commitToDb";

export const SEARCH_PAGE_COMMENT_SELECT_FIELDS = {
	select: {
		id: true,
		body: true,
		_count: { select: { likes: true, dislikes: true } },
		createdAt: true,
		post: {
			select: {
				id: true,
				title: true,
				createdAt: true,
				subreddit: {
					select: {
						id: true,
						name: true,
					},
				},
				user: {
					select: {
						name: true,
					},
				},
				_count: {
					select: {
						likes: true,
						dislikes: true,
						comments: true,
					},
				},
			},
		},
		user: {
			select: {
				name: true,
			},
		},
	},
};

export const getCommentsFromQuery = async (
	query: string,
	extraOptions: Prisma.CommentFindManyArgs = {}
) => {
	return await commitToDb(
		prisma.comment.findMany({
			where: {
				body: { contains: query, mode: "insensitive" },
			},
			...SEARCH_PAGE_COMMENT_SELECT_FIELDS,
			...extraOptions,
		})
	);
};
