import { Post, Subreddit, User } from "@prisma/client";

export function checkEarlyReturn(userId: string | undefined) {
	return userId == null || userId === "";
}

export function earlyReturn(container: ContainerWithPosts) {
	const posts = container.posts.map((post: Post) => {
		return { ...post, likedByMe: 0 };
	});

	return {
		...container,
		posts,
	};
}
