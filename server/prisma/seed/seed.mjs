import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// npx prisma migrate dev
// npx prisma db seed

// npx prisma studio

async function seed() {
	await prisma.post.deleteMany();
	await prisma.user.deleteMany();
	await prisma.subreddit.deleteMany();
	const kyle = await prisma.user.create({
		data: { name: "Kyle", password: "pw", email: "em" },
	});
	const sally = await prisma.user.create({
		data: { name: "Sally", password: "pww", email: "emm" },
	});

	const subreddit1 = await prisma.subreddit.create({
		data: { name: "nba" },
	});
	const subreddit2 = await prisma.subreddit.create({
		data: { name: "bna" },
	});

	const post1 = await prisma.post.create({
		data: {
			body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer placerat urna vel ante volutpat, ut elementum mi placerat. Phasellus varius nisi a nisl interdum, at ultrices ex tincidunt. Duis nec nunc vel urna ullamcorper eleifend ac id dolor. Phasellus vitae tortor ac metus laoreet rutrum. Aenean condimentum consequat elit, ut placerat massa mattis vitae. Vivamus dictum faucibus massa, eget euismod turpis pretium a. Aliquam rutrum rhoncus mi, eu tincidunt mauris placerat nec. Nunc sagittis libero sed facilisis suscipit. Curabitur nisi lacus, ullamcorper eu maximus quis, malesuada sit amet nisi. Proin dignissim, lacus vitae mattis fermentum, dui dolor feugiat turpis, ut euismod libero purus eget dui.",
			title: "Post 1",
			userId: kyle.id,
			subredditId: subreddit1.id,
		},
	});
	const post2 = await prisma.post.create({
		data: {
			body: "Proin ut sollicitudin lacus. Mauris blandit, turpis in efficitur lobortis, lectus lacus dictum ipsum, vel pretium ex lacus id mauris. Aenean id nisi eget tortor viverra volutpat sagittis sit amet risus. Sed malesuada lectus eget metus sollicitudin porttitor. Fusce at sagittis ligula. Pellentesque vel sapien nulla. Morbi at purus sed nibh mollis ornare sed non magna. Nunc euismod ex purus, nec laoreet magna iaculis quis. Mauris non venenatis elit. Curabitur varius lectus nisl, vitae tempus felis tristique sit amet.",
			title: "Post 2",
			userId: kyle.id,
			subredditId: subreddit2.id,
		},
	});
	const post3 = await prisma.post.create({
		data: {
			body: "Proin ut sollicitudin lacus. Mauris blandit, turpis in efficitur lobortis, lectus lacus dictum ipsum, vel pretium ex lacus id mauris. Aenean id nisi eget tortor viverra volutpat sagittis sit amet risus. Sed malesuada lectus eget metus sollicitudin porttitor. Fusce at sagittis ligula. Pellentesque vel sapien nulla. Morbi at purus sed nibh mollis ornare sed non magna. Nunc euismod ex purus, nec laoreet magna iaculis quis. Mauris non venenatis elit. Curabitur varius lectus nisl, vitae tempus felis tristique sit amet.",
			title: "Post 2",
			userId: kyle.id,
			subredditId: subreddit2.id,
		},
	});
	const post4 = await prisma.post.create({
		data: {
			body: "Proin ut sollicitudin lacus. Mauris blandit, turpis in efficitur lobortis, lectus lacus dictum ipsum, vel pretium ex lacus id mauris. Aenean id nisi eget tortor viverra volutpat sagittis sit amet risus. Sed malesuada lectus eget metus sollicitudin porttitor. Fusce at sagittis ligula. Pellentesque vel sapien nulla. Morbi at purus sed nibh mollis ornare sed non magna. Nunc euismod ex purus, nec laoreet magna iaculis quis. Mauris non venenatis elit. Curabitur varius lectus nisl, vitae tempus felis tristique sit amet.",
			title: "Post 2",
			userId: kyle.id,
			subredditId: subreddit2.id,
		},
	});
	const post5 = await prisma.post.create({
		data: {
			body: "Proin ut sollicitudin lacus. Mauris blandit, turpis in efficitur lobortis, lectus lacus dictum ipsum, vel pretium ex lacus id mauris. Aenean id nisi eget tortor viverra volutpat sagittis sit amet risus. Sed malesuada lectus eget metus sollicitudin porttitor. Fusce at sagittis ligula. Pellentesque vel sapien nulla. Morbi at purus sed nibh mollis ornare sed non magna. Nunc euismod ex purus, nec laoreet magna iaculis quis. Mauris non venenatis elit. Curabitur varius lectus nisl, vitae tempus felis tristique sit amet.",
			title: "Post 2",
			userId: kyle.id,
			subredditId: subreddit2.id,
		},
	});

	const comment1 = await prisma.comment.create({
		data: {
			body: "I am a root comment",
			userId: kyle.id,
			postId: post1.id,
		},
	});

	const comment2 = await prisma.comment.create({
		data: {
			parentId: comment1.id,
			body: "I am a nested comment",
			userId: sally.id,
			postId: post1.id,
		},
	});

	const comment3 = await prisma.comment.create({
		data: {
			body: "I am another root comment",
			userId: sally.id,
			postId: post1.id,
		},
	});

	const nc1 = await prisma.comment.create({
		data: {
			parentId: comment1.id,
			body: "I am a nested comment",
			userId: kyle.id,
			postId: post1.id,
		},
	});
	const nc2 = await prisma.comment.create({
		data: {
			parentId: comment1.id,
			body: "I am a nested comment",
			userId: kyle.id,
			postId: post1.id,
		},
	});
	const nnc1_1 = await prisma.comment.create({
		data: {
			parentId: nc1.id,
			body: "I am a nested comment",
			userId: kyle.id,
			postId: post1.id,
		},
	});
	const nnc2_1 = await prisma.comment.create({
		data: {
			parentId: nc2.id,
			body: "I am a nested comment",
			userId: kyle.id,
			postId: post1.id,
		},
	});
}

export function makeString(min, max) {
	var text = "";
	var possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 _";

	const length = min + Math.floor(Math.random() * (max - min));

	for (var i = 0; i < length; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

seed();
