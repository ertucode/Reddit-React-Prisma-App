import { commitToDb } from "./commitToDb";
import { app, prisma } from "../app";
import { formatPostContainer } from "./utils/formatPosts";
import { Post, Prisma, Subreddit } from "@prisma/client";
import { POST_FIELDS } from "./subredditController";
import { checkEarlyReturn } from "./utils/checkEarlyReturn";

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
	const query = req.params.query;
	let count = parseInt(req.params.count);

	if (count == null) {
		return res.send(app.httpErrors.badRequest("Invalid count"));
	}

	return await commitToDb(
		prisma.comment.findMany({
			where: {
				body: { contains: query, mode: "insensitive" },
			},
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
			take: count,
		})
	);
};

const USER_SELECT = {
	id: true,
	name: true,
	_count: {
		select: {
			likedPosts: true,
			likedComments: true,
			dislikedPosts: true,
			dislikedComments: true,
		},
	},
};

export const searchUsers: SearchCallback = async (req, res) => {
	const query = req.params.query;
	let count = parseInt(req.params.count);

	if (count == null) {
		return res.send(app.httpErrors.badRequest("Invalid count"));
	}

	const userId = req.cookies.userId;

	const users: Subreddit[] =
		(await commitToDb(
			prisma.user.findMany({
				where: {
					name: { contains: query, mode: "insensitive" },
				},
				select: {
					...USER_SELECT,
				},
				take: count,
			})
		)) || [];

	if (!checkEarlyReturn(userId)) {
		const user = await prisma.user.findFirst({
			where: {
				id: userId,
			},
			select: {
				followedUsers: {
					select: {
						id: true,
					},
				},
			},
		});

		const followedUserIds = user?.followedUsers?.map((_user) => _user.id);

		users.map((_user: any) => {
			_user.followedByMe = followedUserIds?.includes(_user.id);
			return _user;
		});
	} else {
		users.map((_user: any) => {
			_user.followedByMe = false;
			return _user;
		});
	}

	return users;
};

const SUBREDDIT_SELECT = {
	id: true,
	name: true,
	description: true,
	_count: { select: { subscribedUsers: true } },
};

export const searchSubreddits: SearchCallback = async (req, res) => {
	const query = req.params.query;
	let count = parseInt(req.params.count);

	if (count == null) {
		return res.send(app.httpErrors.badRequest("Invalid count"));
	}

	const userId = req.cookies.userId;

	const subreddits: Subreddit[] =
		(await commitToDb(
			prisma.subreddit.findMany({
				where: {
					name: { contains: query, mode: "insensitive" },
				},
				select: {
					...SUBREDDIT_SELECT,
				},
				take: count,
			})
		)) || [];

	if (!(count <= subreddits.length)) {
		const subredditIds = subreddits.map((sub: Subreddit) => sub.id);

		subreddits.push(
			...((await commitToDb(
				prisma.subreddit.findMany({
					where: {
						description: { contains: query, mode: "insensitive" },
						NOT: {
							id: {
								in: subredditIds,
							},
						},
					},
					select: {
						...SUBREDDIT_SELECT,
					},
					take: count - subreddits.length,
				})
			)) || [])
		);
	}

	if (!checkEarlyReturn(userId)) {
		const user = await prisma.user.findFirst({
			where: {
				id: userId,
			},
			select: {
				subbedTo: {
					select: {
						id: true,
					},
				},
			},
		});

		const joinedSubredditIds = user?.subbedTo?.map((sub) => sub.id);

		subreddits.map((sub: any) => {
			sub.subscribedByMe = joinedSubredditIds?.includes(sub.id);
			return sub;
		});
	} else {
		subreddits.map((sub: any) => {
			sub.subscribedByMe = false;
			return sub;
		});
	}

	return subreddits;
};
