import { Post, User } from "@prisma/client";
import { MyRequest } from "../userController";
import { prisma } from "../../app";

type UserWithPosts = User & { posts: Post[] };

export default async function formatPosts(posts: Post[], userId: string) {
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
