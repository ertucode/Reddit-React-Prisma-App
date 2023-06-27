import { Comment, Post, PrismaClient, Subreddit, User } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";
import { Dictionary } from "./seedUtils";

import {
	fetchRandomWords,
	fetchUsers,
	makeRandomDescription,
	makeRandomParagraph,
	makeRandomPost,
	makeRandomComment,
	getRandomWordsFromDictionary,
	postOptions,
	makeRandomSentence,
	commentOptions,
} from "./seedUtils";

// npx prisma migrate dev
// npx prisma db seed
// npx prisma studio

const NUM_OF_RANDOM_WORDS = 5000;
const NUM_OF_USERS = 15;
const NUM_OF_SUBS = 10;
const NUM_OF_POSTS = 34;
const NUM_OF_COMMENT1 = 289;
const NUM_OF_COMMENT2 = 100;
const NUM_OF_COMMENT3 = 50;

// const NUM_OF_SUBSCRIPTIONS = 300;
// const NUM_OF_FOLLOWS = 50;

const NUM_OF_COMMENT_LIKES = 300;
const NUM_OF_POST_LIKES = 200;

const NUM_OF_ADMIN_COMMENT_LIKES = 60;
const NUM_OF_ADMIN_POST_LIKES = 50;

const NUM_OF_ADMIN_COMMENT_DISLIKES = 20;
const NUM_OF_ADMIN_POST_DISLIKES = 10;

const NUM_OF_ADMIN_POSTS = 12;
const NUM_OF_ADMIN_PARENT_COMMENTS = 30;
const NUM_OF_ADMIN_CHILD_COMMENTS = 40;

const NUM_OF_PARENT_COMMENTS_TO_ADMIN = 50;
const NUM_OF_CHILD_COMMENTS_TO_ADMIN = 25;

const NUM_OF_ADMIN_SUBSCRIPTIONS = 4;
const NUM_OF_ADMIN_FOLLOWS = 2;

async function seed() {
    console.log('deleting everything')
	await prisma.post.deleteMany();
	await prisma.user.deleteMany();
	await prisma.subreddit.deleteMany();

	const users: User[] = [];
	const randomUsers = await fetchUsers(NUM_OF_USERS);

    console.log('creating users')
	for await (const u of randomUsers) {
		const user = await prisma.user.upsert({
			where: { name: u.name },
			create: u,
			update: {},
		});

		if (user != null) {
			users.push(user);
		}
	}

    console.log('creating subreddits')
	const subreddits: Subreddit[] = [];

	const dictionary = await fetchRandomWords(NUM_OF_RANDOM_WORDS);

	const randomSubredditNames = getRandomWordsFromDictionary(
		dictionary,
		NUM_OF_SUBS
	);

	for await (const name of randomSubredditNames) {
		const subreddit = await prisma.subreddit.upsert({
			where: { name },
			update: {},
			create: { name, description: makeRandomDescription(dictionary) },
		});

		if (subreddit != null) {
			subreddits.push(subreddit);
		}
	}

    console.log('creating posts')
	const posts = await myPrisma.createRandomPosts(
		dictionary,
		NUM_OF_POSTS,
		subreddits,
		users
	);

    console.log('creating comments')
	const comments1 = await myPrisma.createRandomParentComments(
		dictionary,
		NUM_OF_COMMENT1,
		posts,
		users
	);
	const comments2 = await myPrisma.createRandomChildComments(
		dictionary,
		NUM_OF_COMMENT2,
		users,
		comments1
	);
	const comments3 = await myPrisma.createRandomChildComments(
		dictionary,
		NUM_OF_COMMENT3,
		users,
		comments2
	);

	const allComments = [...comments1, ...comments2, ...comments3];

    console.log('creating likes and dislikes')
	await myPrisma.createManyCommentLikes(
		NUM_OF_COMMENT_LIKES,
		users,
		allComments
	);
	await myPrisma.createManyCommentDislikes(
		NUM_OF_COMMENT_LIKES,
		users,
		allComments
	);
	await myPrisma.createManyPostLikes(NUM_OF_POST_LIKES, users, posts);
	await myPrisma.createManyPostDislikes(NUM_OF_POST_LIKES, users, posts);
	// await myPrisma.createManySubscriptions(
	// 	NUM_OF_SUBSCRIPTIONS,
	// 	users,
	// 	subreddits
	// );
	// await myPrisma.createManyFollows(NUM_OF_FOLLOWS, users, users);

	// ADMIN
    console.log('creating the admin acc')
	const admin = await prisma.user.create({
		data: {
			name: "admin",
			password: saltPassword("password"),
			email: "admin@admin.com",
		},
	});

	const adminPosts = await myPrisma.createRandomPosts(
		dictionary,
		NUM_OF_ADMIN_POSTS,
		subreddits,
		[admin]
	);

	const adminComments = await myPrisma.createRandomParentComments(
		dictionary,
		NUM_OF_ADMIN_PARENT_COMMENTS,
		posts,
		[admin]
	);
	adminComments.push(
		...(await myPrisma.createRandomChildComments(
			dictionary,
			NUM_OF_ADMIN_CHILD_COMMENTS,
			[admin],
			allComments
		))
	);
	const commentsToAdmin = await myPrisma.createRandomParentComments(
		dictionary,
		NUM_OF_PARENT_COMMENTS_TO_ADMIN,
		adminPosts,
		users
	);
	await myPrisma.createRandomChildComments(
		dictionary,
		NUM_OF_CHILD_COMMENTS_TO_ADMIN,
		users,
		commentsToAdmin
	);
	await myPrisma.createManyCommentLikes(
		NUM_OF_ADMIN_COMMENT_LIKES,
		users,
		adminComments
	);
	await myPrisma.createManyCommentDislikes(
		NUM_OF_ADMIN_COMMENT_DISLIKES,
		users,
		adminComments
	);
	await myPrisma.createManyPostLikes(
		NUM_OF_ADMIN_POST_LIKES,
		users,
		adminPosts
	);
	await myPrisma.createManyPostDislikes(
		NUM_OF_ADMIN_POST_DISLIKES,
		users,
		adminPosts
	);
	await myPrisma.createManySubscriptions(
		NUM_OF_ADMIN_SUBSCRIPTIONS,
		[admin],
		subreddits
	);
	await myPrisma.createManyFollows(NUM_OF_ADMIN_FOLLOWS, users, [admin]);
}

seed();

function randomItem<T>(array: T[]) {
	return array[Math.floor(Math.random() * array.length)];
}

export function saltPassword(password: string) {
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);
	return hash;
}

// function makeString(min: number, max: number) {
// 	var text = "";
// 	var possible =
// 		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 _";

// 	const length = min + Math.floor(Math.random() * (max - min));

// 	for (var i = 0; i < length; i++)
// 		text += possible.charAt(Math.floor(Math.random() * possible.length));

// 	return text;
// }

const myPrisma = {
	createRandomChildComments: async (
		dictionary: Dictionary,
		count: number,
		users: User[],
		parents: Comment[]
	) => {
		const comments: Comment[] = [];
		for (let i = 0; i < count; i++) {
			const parent = randomItem(parents);
			const comment = await prisma.comment.create({
				data: {
					body: makeRandomComment(dictionary, commentOptions),
					userId: randomItem(users).id,
					postId: parent.postId,
					parentId: parent.id,
				},
			});

			if (comment != null) {
				comments.push(comment);
			}
		}
		return comments;
	},
	createRandomParentComments: async (
		dictionary: Dictionary,
		count: number,
		posts: Post[],
		users: User[]
	) => {
		const comments: Comment[] = [];
		for (let i = 0; i < count; i++) {
			const comment = await prisma.comment.create({
				data: {
					body: makeRandomComment(dictionary, commentOptions),
					userId: randomItem(users).id,
					postId: randomItem(posts).id,
				},
			});

			if (comment != null) {
				comments.push(comment);
			}
		}
		return comments;
	},
	createRandomPosts: async (
		dictionary: Dictionary,
		count: number,
		subreddits: Subreddit[],
		users: User[]
	) => {
		const posts: Post[] = [];

		for (let i = 0; i < count; i++) {
			const post = await prisma.post.create({
				data: {
					body: makeRandomPost(dictionary, postOptions),
					title: makeRandomSentence(dictionary, { min: 3, max: 10 }),
					userId: randomItem(users).id,
					subredditId: randomItem(subreddits).id,
				},
			});
			if (post != null) {
				posts.push(post);
			}
		}
		return posts;
	},
	createManySubscriptions: async (
		count: number,
		users: User[],
		subreddits: Subreddit[]
	) => {
		for (let i = 0; i < count; i++) {
			await prisma.subreddit.update({
				where: {
					id: randomItem(subreddits).id,
				},
				data: {
					subscribedUsers: {
						connect: {
							id: randomItem(users).id,
						},
					},
				},
			});
		}
	},
	createManyFollows: async (
		count: number,
		users: User[],
		followers: User[]
	) => {
		for (let i = 0; i < count; i++) {
			await prisma.user.update({
				where: {
					id: randomItem(users).id,
				},
				data: {
					followedBy: {
						connect: {
							id: randomItem(followers).id,
						},
					},
				},
			});
		}
	},
	createManyCommentLikes: async (
		count: number,
		users: User[],
		comments: Comment[]
	) => {
		for (let i = 0; i < count; i++) {
			const userId = randomItem(users).id;
			const commentId = randomItem(comments).id;
			await prisma.commentLike.upsert({
				where: {
					userId_commentId: {
						userId,
						commentId,
					},
				},
				update: {},
				create: {
					userId: userId,
					commentId: commentId,
				},
			});
		}
	},
	createManyCommentDislikes: async (
		count: number,
		users: User[],
		comments: Comment[]
	) => {
		for (let i = 0; i < count; i++) {
			const userId = randomItem(users).id;
			const commentId = randomItem(comments).id;
			await prisma.commentDislike.upsert({
				where: {
					userId_commentId: {
						userId,
						commentId,
					},
				},
				update: {},
				create: {
					userId: userId,
					commentId: commentId,
				},
			});
		}
	},
	createManyPostLikes: async (
		count: number,
		users: User[],
		posts: Post[]
	) => {
		for (let i = 0; i < count; i++) {
			const userId = randomItem(users).id;
			const postId = randomItem(posts).id;
			await prisma.postLike.upsert({
				where: {
					userId_postId: {
						userId,
						postId,
					},
				},
				update: {},
				create: {
					userId: userId,
					postId: postId,
				},
			});
		}
	},
	createManyPostDislikes: async (
		count: number,
		users: User[],
		posts: Post[]
	) => {
		for (let i = 0; i < count; i++) {
			const userId = randomItem(users).id;
			const postId = randomItem(posts).id;
			await prisma.postDislike.upsert({
				where: {
					userId_postId: {
						userId,
						postId,
					},
				},
				update: {},
				create: {
					userId: userId,
					postId: postId,
				},
			});
		}
	},
};
