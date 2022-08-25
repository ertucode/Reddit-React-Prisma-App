import { commitToDb } from "./commitToDb";
import { app, prisma } from "../app";

import bcrypt from "bcrypt";
import { POST_FIELDS } from "./subredditController";
import { formatPostContainer } from "./utils/formatPosts";
import { checkEarlyReturn } from "./utils/checkEarlyReturn";

// PUT -
export const updateUser: UserFastifyCallback = async (req, res) => {
	const userId = req.params.id;

	if (userId !== req.cookies.userId) {
		return res.send(app.httpErrors.unauthorized("Token does not match"));
	}

	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
	});

	const userWithSameName =
		req.body.name &&
		(await prisma.user.findFirst({
			where: {
				name: req.body.name,
			},
		}));
	if (userWithSameName != null) {
		return res.send(app.httpErrors.badRequest("Username already exists"));
	}

	const userWithSameEmail =
		req.body.email &&
		(await prisma.user.findFirst({
			where: {
				email: req.body.email,
			},
			select: {
				name: true,
				email: true,
			},
		}));

	if (userWithSameEmail != null) {
		return res.send(app.httpErrors.badRequest("Email already exists"));
	}

	if (req.body.password) {
		const salt = bcrypt.genSaltSync(10);
		req.body.password = bcrypt.hashSync(req.body.password, salt);
	}

	return await commitToDb(
		prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				...req.body,
			},
			select: {
				id: true,
				name: true,
				email: true,
			},
		})
	);
};
export const deleteUser: UserFastifyCallback = async (req, res) => {
	const userId = req.params.id;

	if (userId !== req.cookies.userId) {
		return res.send(app.httpErrors.unauthorized("Token does not match"));
	}

	return await commitToDb(
		prisma.user.delete({
			where: {
				id: userId,
			},
			select: {
				id: true,
			},
		})
	);
};

export const getUserFromCookie: UserFastifyCallback = async (req, res) => {
	const userId = req.cookies.userId;

	if (userId == null) {
		return res.send(app.httpErrors.badRequest("You are not logged in"));
	}

	return await commitToDb(
		prisma.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				id: true,
				name: true,
			},
		})
	);
};

const USER_SELECT = {
	select: {
		id: true,
		name: true,
		posts: {
			orderBy: {
				createdAt: "desc" as const,
			},
			select: {
				...POST_FIELDS,
			},
		},
	},
};

export const getUserById: UserFastifyCallback = async (req, res) => {
	const userId = req.cookies.userId;

	// Implement conditional returning of some properties

	return await commitToDb(
		prisma.user.findUnique({
			where: {
				id: req.params.id,
			},
			...USER_SELECT,
		})
	);
};

export const getUserPosts: UserFastifyCallback = async (req, res) => {
	// const userId = req.cookies.userId;
	// Implement conditional returning of some properties

	const user = await commitToDb(
		prisma.user.findUnique({
			where: {
				name: req.params.name,
			},
			select: {
				id: true,
			},
		})
	);

	if (user == null) {
		return res.send(app.httpErrors.badRequest("Username does not exist"));
	}

	return await commitToDb(
		prisma.user.findUnique({
			where: {
				name: req.params.name,
			},
			...USER_SELECT,
		})
	).then(async (user) => {
		return await formatPostContainer(user, req, res);
	});
};

const USER_COMMENT_SELECT = {
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
			},
		},
	},
};

export const getUserComments: UserFastifyCallback = async (req, res) => {
	// const userId = req.cookies.userId;
	// Implement conditional returning of some properties

	const user = await commitToDb(
		prisma.user.findUnique({
			where: {
				name: req.params.name,
			},
			...USER_COMMENT_SELECT,
		})
	);

	if (user == null) {
		return res.send(app.httpErrors.badRequest("Username does not exist"));
	}

	return user;
};

export const followUser: UserFastifyCallback = async (req, res) => {
	const userId = req.cookies.userId;

	if (checkEarlyReturn(userId)) {
		return res.send(
			app.httpErrors.unauthorized(
				"You can not follow a user since you are not logged in"
			)
		);
	}

	const user = await prisma.user.findFirst({
		where: {
			id: userId,
		},
		select: {
			id: true,
		},
	});

	if (user == null) {
		return res.send(
			app.httpErrors.internalServerError(
				"I can't write code, you don't exist"
			)
		);
	}

	const userO = await prisma.user.findFirst({
		where: {
			name: req.params.name,
		},
		select: {
			followedBy: {
				select: {
					id: true,
				},
			},
		},
	});

	const toSet = userO ? [...userO.followedBy, user] : [user];

	return await commitToDb(
		prisma.user.update({
			where: {
				name: req.params.name,
			},
			data: {
				followedBy: {
					set: toSet,
				},
			},
			select: {
				name: true,
			},
		})
	);
};

export const unfollowUser: UserFastifyCallback = async (req, res) => {
	const userId = req.cookies.userId;

	if (checkEarlyReturn(userId)) {
		return res.send(
			app.httpErrors.unauthorized(
				"You can not unfollow a user since you are not logged in"
			)
		);
	}

	const user = await prisma.user.findFirst({
		where: {
			id: userId,
		},
		select: {
			id: true,
		},
	});

	if (user == null) {
		return res.send(
			app.httpErrors.internalServerError(
				"I can't write code, you don't exist"
			)
		);
	}

	const userO = await prisma.user.findFirst({
		where: {
			name: req.params.name,
		},
		select: {
			followedBy: {
				select: {
					id: true,
				},
			},
		},
	});

	return await commitToDb(
		prisma.user.update({
			where: {
				name: req.params.name,
			},
			data: {
				followedBy: {
					set:
						userO?.followedBy.filter(
							(follower) => follower.id !== user.id
						) || [],
				},
			},
			select: {
				name: true,
			},
		})
	);
};

export const getUserPageInfo: UserFastifyCallback = async (req, res) => {
	const user = await commitToDb(
		prisma.user.findFirst({
			where: {
				name: req.params.name,
			},
			select: {
				id: true,
			},
		})
	);

	if (user == null) {
		return res.send(
			app.httpErrors.internalServerError("User does not exist")
		);
	}

	const userId = req.cookies.userId;

	if (!checkEarlyReturn(userId)) {
		const queryingUser = await prisma.user.findFirst({
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

		const ids = queryingUser?.followedUsers?.map((u) => u.id);

		user.followedByMe = ids && ids.includes(user.id);
	} else {
		user.followedByMe = false;
	}

	return user;
};
