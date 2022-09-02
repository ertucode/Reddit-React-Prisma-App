import { POST_FIELDS } from "../subredditController";
import { prisma, app } from "../../app";
import { commitToDb } from "../commitToDb";
import { formatPostContainer } from "./formatPosts";
import { Prisma, User } from "@prisma/client";
import { checkEarlyReturn } from "./checkEarlyReturn";

export const getFollowsOfUser = async (userId: string) => {
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
			subbedTo: {
				select: {
					id: true,
				},
			},
		},
	});

	const subIds = user?.subbedTo.map((sub) => sub.id);
	const userIds = user?.followedUsers.map((u) => u.id);

	return { subIds, userIds };
};

export const USER_FOLLOW_WHERE_FIELDS = (
	subIds: string[] | undefined,
	userIds: string[] | undefined
) => {
	return {
		where: {
			OR: [
				{
					subredditId: {
						in: subIds,
					},
				},
				{
					userId: {
						in: userIds,
					},
				},
			],
		},
	};
};

export const USER_POSTS_SELECT = (
	extraPostOptions: Prisma.PostFindManyArgs
) => {
	return {
		select: {
			id: true,
			name: true,
			posts: {
				orderBy: {
					createdAt: "desc" as const,
				},
				select: POST_FIELDS,
				...extraPostOptions,
			},
		},
	};
};

export const USER_COMMENTS_SELECT = (
	extraCommentOptions: Prisma.CommentFindManyArgs = {}
) => {
	return {
		select: {
			id: true,
			name: true,
			comments: {
				orderBy: {
					createdAt: "desc" as const,
				},
				select: {
					id: true,
					body: true,
					post: {
						select: {
							id: true,
							title: true,
							subreddit: { select: { name: true } },
							user: {
								select: {
									name: true,
								},
							},
						},
					},
					_count: { select: { likes: true, dislikes: true } },
					createdAt: true,
					parentId: true,
					scrollIndex: true,
				},
				...extraCommentOptions,
			},
		},
	};
};

export const getUserPostsFromName = async (
	name: string,
	extraOptions: Prisma.PostFindManyArgs,
	req: ContainerRequest,
	res: ContainerResponse
) => {
	return await commitToDb(
		prisma.user.findUnique({
			where: { name },
			...USER_POSTS_SELECT(extraOptions),
		})
	).then(async (user) => {
		return await formatPostContainer(user, req, res);
	});
};

export const getUserCommentsFromId = async (
	id: string,
	extraOptions: Prisma.CommentFindManyArgs
) => {
	return await commitToDb(
		prisma.user.findUnique({
			where: { id },
			...USER_COMMENTS_SELECT(extraOptions),
		})
	);
};

export const getUserCommentsFromName = async (
	name: string,
	extraOptions: Prisma.CommentFindManyArgs
) => {
	return await commitToDb(
		prisma.user.findUnique({
			where: { name },
			...USER_COMMENTS_SELECT(extraOptions),
		})
	);
};

export const sendUserCommentsFromId = async (
	id: string,
	extraOptions: Prisma.CommentFindManyArgs,
	req: ContainerRequest,
	res: ContainerResponse
) => {
	const user = await getUserCommentsFromId(id, extraOptions);

	if (user == null) {
		return res.send(app.httpErrors.badRequest("User id does not exist"));
	}

	return user;
};

export const sendUserCommentsFromName = async (
	name: string,
	extraOptions: Prisma.CommentFindManyArgs,
	req: ContainerRequest,
	res: ContainerResponse
) => {
	const user = await getUserCommentsFromName(name, extraOptions);

	if (user == null) {
		return res.send(app.httpErrors.badRequest("Username does not exist"));
	}

	return user;
};

const USER_SELECT = {
	id: true,
	name: true,
	createdAt: true,
	_count: {
		select: {
			likedPosts: true,
			likedComments: true,
			dislikedPosts: true,
			dislikedComments: true,
		},
	},
};

export const getUsersFromQuery = async (
	query: string,
	additionalFindManyArgs: Prisma.UserFindManyArgs = {},
	additionalWhereArgs: Prisma.UserWhereInput = {}
) => {
	return await prisma.user.findMany({
		where: {
			name: { contains: query, mode: "insensitive" },
			...additionalWhereArgs,
		},
		select: {
			...USER_SELECT,
		},
		...additionalFindManyArgs,
	});
};

export const sendUsersWithFollowInfo = async (
	userId: string,
	users: User[]
) => {
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

export const MAIN_USER_SELECT = Prisma.validator<Prisma.UserSelect>()({
	id: true,
	name: true,
	posts: {
		select: {
			_count: {
				select: { likes: true, dislikes: true },
			},
		},
	},
	comments: {
		select: {
			_count: {
				select: { likes: true, dislikes: true },
			},
		},
	},
});
