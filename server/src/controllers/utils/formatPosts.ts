import { Post, User } from "@prisma/client";
import { app, prisma } from "../../app";
import { checkEarlyReturn, earlyReturn } from "./checkEarlyReturn";

async function formatPosts(posts: Post[], userId: string) {
	const likes = await prisma.user.findFirst({
		where: {
			id: userId,
		},
		select: {
			likedPosts: {
				where: {
					postId: {
						in: posts.map((post: Post) => post.id),
					},
				},
				select: {
					postId: true,
				},
			},
			dislikedPosts: {
				where: {
					postId: {
						in: posts.map((post: Post) => post.id),
					},
				},
				select: {
					postId: true,
				},
			},
		},
	});

	const formattedPosts = posts.map((post: Post) => {
		if (
			likes?.likedPosts?.find((likedPost) => likedPost.postId === post.id)
		) {
			return { ...post, likedByMe: 1 };
		} else if (
			likes?.dislikedPosts?.find(
				(dislikedPost) => dislikedPost.postId === post.id
			)
		) {
			return { ...post, likedByMe: -1 };
		}
		return { ...post, likedByMe: 0 };
	});

	return formattedPosts;
}

export const formatPostContainer = async (
	container: ContainerWithPosts,
	req: ContainerRequest,
	res: ContainerResponse
) => {
	if (container == null) {
		return res.send(app.httpErrors.badRequest("Post does not exist"));
	}

	// If no cookie early return

	const userId = req.cookies.userId;
	const shouldReturn = checkEarlyReturn(userId);

	if (shouldReturn) {
		return earlyReturn(container);
	}

	const posts = await formatPosts(container.posts, userId!);

	return {
		...container,
		posts,
	};
};
