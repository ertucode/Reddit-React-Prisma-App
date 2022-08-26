import { Comment, Post, PrismaClient, Subreddit, User } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";

async function seed() {
	await prisma.post.deleteMany();
	await prisma.user.deleteMany();
	await prisma.subreddit.deleteMany();

	const users: User[] = [];

	for (let i = 0; i < 100; i++) {
		const user = await prisma.user.create({
			data: {
				name: makeString(6, 15),
				password: makeString(5, 10),
				email: makeString(8, 15),
			},
		});

		if (user != null) {
			users.push(user);
		}
	}

	const subreddits: Subreddit[] = [];

	for (let i = 0; i < 50; i++) {
		const subreddit = await prisma.subreddit.create({
			data: { name: makeString(6, 15) },
		});

		if (subreddit != null) {
			subreddits.push(subreddit);
		}
	}

	const posts: Post[] = [];

	for (let i = 0; i < 200; i++) {
		const post = await prisma.post.create({
			data: {
				body: makeString(50, 200),
				title: makeString(10, 30),
				userId: randomItem(users).id,
				subredditId: randomItem(subreddits).id,
			},
		});
		if (post != null) {
			posts.push(post);
		}
	}

	const comments1: Comment[] = [];
	for (let i = 0; i < 1000; i++) {
		const comment = await prisma.comment.create({
			data: {
				body: makeString(10, 50),
				userId: randomItem(users).id,
				postId: randomItem(posts).id,
			},
		});

		if (comment != null) {
			comments1.push(comment);
		}
	}

	const comments2: Comment[] = [];

	for (let i = 0; i < 500; i++) {
		const comment = await prisma.comment.create({
			data: {
				body: makeString(10, 50),
				userId: randomItem(users).id,
				postId: randomItem(posts).id,
				parentId: randomItem(comments1).id,
			},
		});

		if (comment != null) {
			comments2.push(comment);
		}
	}

	const comments3: Comment[] = [];

	for (let i = 0; i < 200; i++) {
		const comment = await prisma.comment.create({
			data: {
				body: makeString(10, 50),
				userId: randomItem(users).id,
				postId: randomItem(posts).id,
				parentId: randomItem(comments2).id,
			},
		});

		if (comment != null) {
			comments3.push(comment);
		}
	}

	const admin = await prisma.user.create({
		data: {
			name: "admin",
			password: saltPassword("password"),
			email: "admin@admin.com",
		},
	});
}

seed();

function randomItem<T>(array: T[]) {
	return array[Math.floor(Math.random() * array.length)];
}

function makeString(min: number, max: number) {
	var text = "";
	var possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 _";

	const length = min + Math.floor(Math.random() * (max - min));

	for (var i = 0; i < length; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

export function saltPassword(password: string) {
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);
	return hash;
}
