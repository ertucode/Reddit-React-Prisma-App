import { Prisma, Subreddit } from "@prisma/client";
import { prisma } from "../../app";
import { checkEarlyReturn } from "./checkEarlyReturn";

const SUBREDDIT_SELECT = {
	id: true,
	name: true,
	description: true,
	_count: { select: { subscribedUsers: true } },
	createdAt: true,
};

export const getSubredditSearchResult = async (
	query: string,
	field: "name" | "description",
	extraFindManyArgs: Prisma.SubredditFindManyArgs,
	extraWhereOptions: Prisma.SubredditWhereInput = {}
) => {
	return await prisma.subreddit.findMany({
		where: {
			[field]: { contains: query, mode: "insensitive" },
			...extraWhereOptions,
		},
		select: {
			...SUBREDDIT_SELECT,
		},
		...extraFindManyArgs,
	});
};

export const addResultsFromDescription = async (
	query: string,
	extraFindManyArgs: Prisma.SubredditFindManyArgs,
	subreddits: Subreddit[]
) => {
	const subredditIds = subreddits.map((sub) => sub.id);
	const extraSubreddits = await getSubredditSearchResult(
		query,
		"description",
		extraFindManyArgs,
		{ NOT: { id: { in: subredditIds } } }
	);

	subreddits.push(...extraSubreddits);
};

export const sendSubredditsWithSubscriptionInfo = async (
	userId: string,
	subreddits: Subreddit[]
) => {
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

export const sendSubredditSearchResult = async (
	query: string,
	req: SearchRequest,
	take: number,
	additionalFindManyArgs: Prisma.SubredditFindManyArgs = {},
	extraWhereOptions: Prisma.SubredditWhereInput = {}
) => {
	const subreddits = await getSubredditSearchResult(
		query,
		"name",
		{
			take,
			...additionalFindManyArgs,
		},
		extraWhereOptions
	);

	if (!(take <= subreddits.length)) {
		await addResultsFromDescription(
			query,
			{ ...additionalFindManyArgs, take: take - subreddits.length },
			subreddits
		);
	}

	const userId = req.cookies.userId;
	return await sendSubredditsWithSubscriptionInfo(userId, subreddits);
};
