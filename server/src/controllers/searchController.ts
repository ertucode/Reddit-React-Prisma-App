import { commitToDb } from "./commitToDb";
import { app, prisma } from "../app";
import { formatPostContainer } from "./utils/formatPosts";
import { Post, Prisma } from "@prisma/client";
import { POST_FIELDS } from "./subredditController";

type MockModel = {
	name: string;
	type: "Subreddit" | "Post" | "User";
	id: string;
};

export const searchEverything: SearchCallback = async (req, res) => {
	const query = req.params.query;
	let count = parseInt(req.params.count);

	if (count == null) {
		return res.send(app.httpErrors.badRequest("Invalid count"));
	}

	const models: MockModel[] = [];

	models.push(
		...((
			await prisma.subreddit.findMany({
				where: {
					name: { contains: query, mode: "insensitive" },
				},
				select: {
					id: true,
					name: true,
				},
				take: count,
			})
		)?.map((subreddit) => {
			return { ...subreddit, type: "Subreddit" as const };
		}) || [])
	);

	if (count <= models.length) return models;

	models.push(
		...((
			await prisma.post.findMany({
				where: {
					title: { contains: query, mode: "insensitive" },
				},
				select: {
					id: true,
					title: true,
				},
				take: count - models.length,
			})
		)?.map((post) => {
			return { ...post, name: post.title, type: "Post" as const };
		}) || [])
	);

	if (count <= models.length) return models;

	models.push(
		...((
			await prisma.user.findMany({
				where: {
					name: { contains: query, mode: "insensitive" },
				},
				select: {
					id: true,
					name: true,
				},
				take: count - models.length,
			})
		)?.map((subreddit) => {
			return { ...subreddit, type: "User" as const };
		}) || [])
	);

	return models;
};

const POST_SELECTION = {
	orderBy: {
		createdAt: "desc" as const,
	},
	select: {
		...POST_FIELDS,
	},
};

export const searchPosts: SearchCallback = async (req, res) => {
	const query = req.params.query;
	let count = parseInt(req.params.count);

	if (count == null) {
		return res.send(app.httpErrors.badRequest("Invalid count"));
	}

	const posts =
		(await commitToDb(
			prisma.post.findMany({
				where: {
					title: { contains: query, mode: "insensitive" },
				},
				...POST_SELECTION,
				take: count,
			})
		)) || [];

	if (count <= posts?.length) return posts;

	const postIdArray = posts.map((post: Post) => post.id);

	posts.push(
		...((await commitToDb(
			prisma.post.findMany({
				where: {
					body: { contains: query, mode: "insensitive" },
					NOT: {
						id: { in: postIdArray },
					},
				},
				...POST_SELECTION,
				take: count - posts.length,
			})
		)) || [])
	);

	return await formatPostContainer({ posts }, req, res);
};

export const searchComments: SearchCallback = async (req, res) => {
	`search/comments/{query}/{count}`;
};

export const searchUsers: SearchCallback = async (req, res) => {
	`search/users/{query}/{count}`;
};

export const searchSubreddits: SearchCallback = async (req, res) => {
	`search/subreddits/{query}/{count}`;
};
