import { commitToDb } from "./commitToDb";
import { app, prisma } from "../app";
import { formatPostContainer } from "./utils/formatPosts";
import { checkEarlyReturn } from "./utils/checkEarlyReturn";
import { getPosts } from "./postController";

import {
	getFollowsOfUser,
	getUserCommentsFromId,
	getUserPostsFromName,
	getUsersFromQuery,
	sendUserCommentsFromId,
	sendUsersWithFollowInfo,
	USER_FOLLOW_WHERE_FIELDS,
} from "./utils/userHelpers";
import { getCommentsFromQuery } from "./utils/commentHelpers";
import { sendSubredditSearchResult } from "./utils/subredditHelper";

const TAKE_COUNT = 20;

const nextDataLogic = (scrollIndex: number) => {
	return {
		take: TAKE_COUNT,
		skip: 1,
		cursor: { scrollIndex },
	};
};

export const getInfiniteAllPosts: InfiniteScrollFastifyCallback = async (
	req,
	res
) => {
	const scrollIndex = parseInt(req.params.scrollIndex);
	if (isNaN(scrollIndex)) {
		return await getPosts({ take: TAKE_COUNT }, req, res);
	}

	return await getPosts(nextDataLogic(scrollIndex), req, res);
};

export const getInfiniteHomePagePosts: InfiniteScrollFastifyCallback = async (
	req,
	res
) => {
	const userId = req.cookies.userId;
	const scrollIndex = parseInt(req.params.scrollIndex);

	if (checkEarlyReturn(userId)) {
		return res.send(null);
	}

	const { subIds, userIds } = await getFollowsOfUser(userId);

	if (isNaN(scrollIndex)) {
		return await getPosts(
			{
				...USER_FOLLOW_WHERE_FIELDS(subIds, userIds),
				take: TAKE_COUNT,
			},
			req,
			res
		);
	}

	return await getPosts(
		{
			...USER_FOLLOW_WHERE_FIELDS(subIds, userIds),
			...nextDataLogic(scrollIndex),
		},
		req,
		res
	);
};

export const getInfiniteUserPagePosts: InfiniteScrollFastifyCallback = async (
	req,
	res
) => {
	const name = req.params.name;
	const scrollIndex = parseInt(req.params.scrollIndex);

	if (req.params.name == null) {
		return res.send(app.httpErrors.badRequest("Provide a username"));
	}

	if (isNaN(scrollIndex)) {
		return await getUserPostsFromName(name, { take: TAKE_COUNT }, req, res);
	}

	// Most likely wont work
	return await getUserPostsFromName(
		name,
		nextDataLogic(scrollIndex),
		req,
		res
	);
};

export const getInfinitePostSearchResult: InfiniteScrollFastifyCallback =
	async (req, res) => {
		const query = req.params.query;
		const scrollIndex = parseInt(req.params.scrollIndex);

		if (isNaN(scrollIndex)) {
			return await getPosts(
				{
					where: { title: { contains: query, mode: "insensitive" } },
					take: TAKE_COUNT,
				},
				req,
				res
			);
		}

		return await getPosts(
			{
				where: { title: { contains: query, mode: "insensitive" } },
				...nextDataLogic(scrollIndex),
			},
			req,
			res
		);
	};

export const getInfiniteUserPageComments: InfiniteScrollFastifyCallback =
	async (req, res) => {
		const userId = req.cookies.userId;
		const scrollIndex = parseInt(req.params.scrollIndex);

		if (isNaN(scrollIndex)) {
			return await sendUserCommentsFromId(
				userId,
				{ take: TAKE_COUNT },
				req,
				res
			);
		}
		return await sendUserCommentsFromId(
			userId,
			nextDataLogic(scrollIndex),
			req,
			res
		);
	};

export const getInfiniteCommentSearchResult: InfiniteScrollFastifyCallback =
	async (req, res) => {
		const query = req.params.query;
		const scrollIndex = parseInt(req.params.scrollIndex);

		if (isNaN(scrollIndex)) {
			return await getCommentsFromQuery(query, { take: TAKE_COUNT });
		}

		return await getCommentsFromQuery(query, nextDataLogic(scrollIndex));
	};

export const getInfiniteSubredditSearchResult: InfiniteScrollFastifyCallback =
	async (req, res) => {
		const query = req.params.query;
		let count = parseInt(req.params.count);
		const scrollIndex = parseInt(req.params.scrollIndex);

		if (isNaN(count)) {
			return res.send(app.httpErrors.badRequest("Invalid count"));
		}

		if (isNaN(scrollIndex)) {
			return await sendSubredditSearchResult(query, req, TAKE_COUNT);
		}

		return await sendSubredditSearchResult(
			query,
			req,
			TAKE_COUNT,
			nextDataLogic(scrollIndex)
		);
	};

export const getInfiniteUserSearchResult: InfiniteScrollFastifyCallback =
	async (req, res) => {
		const query = req.params.query;
		const scrollIndex = parseInt(req.params.scrollIndex);

		if (isNaN(scrollIndex)) {
			const users = await getUsersFromQuery(query, { take: TAKE_COUNT });
			const userId = req.cookies.userId;
			return await sendUsersWithFollowInfo(userId, users);
		}

		const users = await getUsersFromQuery(
			query,
			nextDataLogic(scrollIndex)
		);
		const userId = req.cookies.userId;
		return await sendUsersWithFollowInfo(userId, users);
	};
