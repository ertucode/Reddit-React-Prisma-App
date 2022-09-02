import { app } from "../app";
import { checkEarlyReturn } from "./utils/checkEarlyReturn";
import { getPosts } from "./postController";

import {
	getFollowsOfUser,
	getUserCommentsFromName,
	getUserPostsFromName,
	getUsersFromQuery,
	sendUserCommentsFromId,
	sendUserCommentsFromName,
	sendUsersWithFollowInfo,
	USER_FOLLOW_WHERE_FIELDS,
} from "./utils/userHelpers";
import { getCommentsFromQuery } from "./utils/commentHelpers";
import { sendSubredditSearchResult } from "./utils/subredditHelper";

// ALWAYS RETURN CREATED AT
const take = 20;
const orderBy = { createdAt: "desc" } as const;
const getWhereForCreatedAt = (createdAt: Date) => {
	return { createdAt: { lt: createdAt } };
};

export const getInfiniteAllPosts: InfiniteScrollFastifyCallback = async (
	req,
	res
) => {
	const createdAt = parseCreatedAt(req);

	if (createdAt) {
		return await getPosts(
			{
				where: getWhereForCreatedAt(createdAt),
				take,
				orderBy,
			},
			req,
			res
		);
	} else {
		return await getPosts({ take, orderBy }, req, res);
	}
};

export const getInfiniteHomePagePosts: InfiniteScrollFastifyCallback = async (
	req,
	res
) => {
	const userId = req.cookies.userId;

	if (checkEarlyReturn(userId)) {
		return res.send(null);
	}

	const { subIds, userIds } = await getFollowsOfUser(userId);

	const createdAt = parseCreatedAt(req);

	if (createdAt) {
		return await getPosts(
			{
				where: {
					...USER_FOLLOW_WHERE_FIELDS(subIds, userIds).where,
					...getWhereForCreatedAt(createdAt),
				},
				take,
				orderBy,
			},
			req,
			res
		);
	} else {
		return await getPosts(
			{
				...USER_FOLLOW_WHERE_FIELDS(subIds, userIds),
				take,
				orderBy,
			},
			req,
			res
		);
	}
};

export const getInfiniteUserPagePosts: InfiniteScrollFastifyCallback = async (
	req,
	res
) => {
	const name = req.params.userName;

	if (name == null) {
		return res.send(app.httpErrors.badRequest("Provide a username"));
	}

	const createdAt = parseCreatedAt(req);

	if (createdAt) {
		return await getUserPostsFromName(
			name,
			{
				where: getWhereForCreatedAt(createdAt),
				take,
				orderBy,
			},
			req,
			res
		);
	} else {
		return await getUserPostsFromName(name, { take, orderBy }, req, res);
	}
};

export const getInfinitePostSearchResult: InfiniteScrollFastifyCallback =
	async (req, res) => {
		const query = req.params.query;

		const createdAt = parseCreatedAt(req);

		if (createdAt) {
			return await getPosts(
				{
					where: {
						title: { contains: query, mode: "insensitive" },
						...getWhereForCreatedAt(createdAt),
					},
					take,
					orderBy,
				},
				req,
				res
			);
		} else {
			return await getPosts(
				{
					where: { title: { contains: query, mode: "insensitive" } },
					take,
					orderBy,
				},
				req,
				res
			);
		}
	};

export const getInfiniteUserPageComments: InfiniteScrollFastifyCallback =
	async (req, res) => {
		const name = req.params.userName;

		if (name == null) {
			return res.send(app.httpErrors.badRequest("Provide a username"));
		}

		const createdAt = parseCreatedAt(req);

		if (createdAt) {
			return await sendUserCommentsFromName(
				name,
				{
					where: getWhereForCreatedAt(createdAt),
					take,
					orderBy,
				},
				req,
				res
			);
		} else {
			return await sendUserCommentsFromName(
				name,
				{ take, orderBy },
				req,
				res
			);
		}
	};

export const getInfiniteCommentSearchResult: InfiniteScrollFastifyCallback =
	async (req, res) => {
		const query = req.params.query;

		const createdAt = parseCreatedAt(req);

		if (createdAt) {
			return await getCommentsFromQuery(
				query,
				getWhereForCreatedAt(createdAt),
				{
					take,
					orderBy,
				}
			);
		} else {
			return await getCommentsFromQuery(
				query,
				{},
				{
					take,
					orderBy,
				}
			);
		}
	};

export const getInfiniteSubredditSearchResult: InfiniteScrollFastifyCallback =
	async (req, res) => {
		const query = req.params.query;

		const createdAt = parseCreatedAt(req);

		if (createdAt) {
			return await sendSubredditSearchResult(
				query,
				req,
				take,
				{ orderBy },
				getWhereForCreatedAt(createdAt)
			);
		} else {
			return await sendSubredditSearchResult(query, req, take, {
				orderBy,
			});
		}
	};

export const getInfiniteUserSearchResult: InfiniteScrollFastifyCallback =
	async (req, res) => {
		const query = req.params.query;

		const createdAt = parseCreatedAt(req);

		let users;

		if (createdAt) {
			users = await getUsersFromQuery(
				query,
				{ take, orderBy },
				getWhereForCreatedAt(createdAt)
			);
		} else {
			users = await getUsersFromQuery(query, {
				take,
				orderBy,
			});
		}

		const userId = req.cookies.userId;
		return await sendUsersWithFollowInfo(userId, users);
	};

const parseCreatedAt = (req: InfiniteScrollRequest) => {
	const createdAt = new Date(req.params.createdAt);

	if (isNaN(createdAt.getTime())) {
		return;
	}

	return createdAt;
};
