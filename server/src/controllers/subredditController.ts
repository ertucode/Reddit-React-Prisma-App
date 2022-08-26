import { commitToDb } from "./commitToDb";
import { app, prisma } from "../app";
import { formatPostContainer } from "./utils/formatPosts";
import { checkEarlyReturn } from "./utils/checkEarlyReturn";

// GET - /subreddits
export const getAllSubreddits: SubredditFastifyCallback = async (req, res) => {
	return await commitToDb(
		prisma.subreddit.findMany({
			select: {
				id: true,
				name: true,
			},
		})
	);
};

export const POST_FIELDS = {
	id: true,
	title: true,
	body: true,
	createdAt: true,
	user: {
		select: {
			id: true,
			name: true,
		},
	},
	_count: { select: { likes: true, dislikes: true, comments: true } },
	subreddit: {
		select: {
			name: true,
			id: true,
		},
	},
};

const SUBREDDIT_SELECT = {
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

// GET - /subreddit/{id}
export const getSubredditById: SubredditFastifyCallback = async (req, res) => {
	return await commitToDb(
		prisma.subreddit.findUnique({
			where: { id: req.params.id },
			...SUBREDDIT_SELECT,
		})
	).then(async (subreddit) => {
		return await formatPostContainer(subreddit, req, res);
	});
};

// GET - /subreddit/name/:name
export const getSubredditByName: SubredditFastifyCallback = async (
	req,
	res
) => {
	return await commitToDb(
		prisma.subreddit.findUnique({
			where: { name: req.params.name },
			...SUBREDDIT_SELECT,
		})
	).then(async (subreddit) => {
		return await formatPostContainer(subreddit, req, res);
	});
};

export const getSubredditDescriptionAndSubbed: SubredditFastifyCallback =
	async (req, res) => {
		type DesiredSubreddit = {
			id: string;
			description: string;
			subscribedByMe?: boolean;
		} | null;

		const desiredSubreddit: DesiredSubreddit =
			await prisma.subreddit.findUnique({
				where: { name: req.params.name },
				select: {
					id: true,
					description: true,
				},
			});

		if (desiredSubreddit == null) {
			return res.send(
				app.httpErrors.badRequest("Subreddit does not exist")
			);
		}

		const userId = req.cookies.userId;

		if (!checkEarlyReturn(userId)) {
			const user = await prisma.user.findUnique({
				where: { id: userId },
				select: {
					subbedTo: {
						select: { id: true },
					},
				},
			});

			const ids = user?.subbedTo?.map((sub) => sub.id);

			desiredSubreddit.subscribedByMe =
				ids && ids.includes(desiredSubreddit.id);
		} else {
			desiredSubreddit.subscribedByMe = false;
		}

		return desiredSubreddit;
	};

// PUT - /subreddit
export const createSubreddit: SubredditFastifyCallback = async (req, res) => {
	const userId = req.cookies.userId;

	if (checkEarlyReturn(userId)) {
		return;
	}

	const name = req.params.name;

	if (name == null || name == "") {
		return res.send(app.httpErrors.badRequest("Include a name"));
	}

	const description = req.body.description;

	if (description == null || description == "") {
		return res.send(app.httpErrors.badRequest("Include a description"));
	}

	const sub = await commitToDb(
		prisma.subreddit.create({
			data: {
				name,
				description,
			},
		})
	);

	return await commitToDb(
		prisma.subreddit.update({
			where: {
				name: sub.name,
			},
			data: {
				admins: {
					set: [{ id: userId }],
				},
			},
			select: {
				name: true,
			},
		})
	);
};

// DELETE - /user/{id}
export const deleteSubreddit: SubredditFastifyCallback = async (req, res) => {};

// POST - /user/{id}
export const updateSubreddit: SubredditFastifyCallback = async (req, res) => {};

export const joinSubreddit: SubredditFastifyCallback = async (req, res) => {
	const userId = req.cookies.userId;

	if (checkEarlyReturn(userId)) {
		return res.send(
			app.httpErrors.unauthorized(
				"You can not join a subreddit since you are not logged in"
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

	const subO = await prisma.subreddit.findFirst({
		where: {
			name: req.params.name,
		},
		select: {
			subscribedUsers: {
				select: {
					id: true,
				},
			},
		},
	});

	const toSet = subO ? [...subO.subscribedUsers, user] : [user];

	return await commitToDb(
		prisma.subreddit.update({
			where: {
				name: req.params.name,
			},
			data: {
				subscribedUsers: {
					set: toSet,
				},
			},
			select: {
				name: true,
			},
		})
	);
};

export const leaveSubreddit: SubredditFastifyCallback = async (req, res) => {
	const userId = req.cookies.userId;

	if (checkEarlyReturn(userId)) {
		return res.send(
			app.httpErrors.unauthorized(
				"You can not leave a subreddit since you are not logged in"
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

	const subO = await prisma.subreddit.findFirst({
		where: {
			name: req.params.name,
		},
		select: {
			subscribedUsers: {
				select: {
					id: true,
				},
			},
		},
	});

	return await commitToDb(
		prisma.subreddit.update({
			where: {
				name: req.params.name,
			},
			data: {
				subscribedUsers: {
					set:
						subO?.subscribedUsers.filter(
							(subscribedUser) => subscribedUser.id !== user.id
						) || [],
				},
			},
			select: {
				name: true,
			},
		})
	);
};
