import { usePost } from "contexts/PostContext";
import React from "react";

import "./styles.scss";
import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";
import { useAsyncFn } from "hooks/useAsync";
import { createComment, ToggleOptions } from "services/comment";
import { togglePostLikeDislike } from "services/post";
import { PostHeader } from "./PostHeader";
import { useNotification } from "features/notification/contexts/NotificationProvider";
import {
	loginToVote,
	UpvoteDownvote,
} from "features/upvote_downvote/UpvoteDownvote";
import { Loading } from "features/loading/Loading";

interface PostProps {}

export const Post: React.FC<PostProps> = () => {
	const {
		post,
		rootComments,
		changeLocalComments,
		toggleLocalPostLike,
		postLoading,
	} = usePost();
	const { loading, execute: createCommentFn } = useAsyncFn(createComment);
	const togglePostLikeDislikeFn = useAsyncFn(togglePostLikeDislike);

	const showNotification = useNotification();

	async function onCommentCreate(body: string) {
		return createCommentFn({ postId: post?.id, body })
			.then((comment: IComment) => {
				// CHECK THIS
				changeLocalComments({
					type: "create",
					payload: {
						comment: { ...comment },
					},
				});
			})
			.catch((e) => {
				loginToCreateComment(e, showNotification);
			});
	}

	async function onTogglePostLikeDislike(option: ToggleOptions) {
		return togglePostLikeDislikeFn
			.execute(post?.id, option)
			.then((e) => {
				toggleLocalPostLike(post?.id || "", e);
			})
			.catch((e) => {
				loginToVote(e, showNotification);
			});
	}

	return post ? (
		<div className="post-card-container">
			<div className="post-card">
				<section className="post-card__top-section">
					<section className="post-card__like-section">
						<UpvoteDownvote
							post={post}
							upvoteCb={() => onTogglePostLikeDislike("Like")}
							downvoteCb={() =>
								onTogglePostLikeDislike("Dislike")
							}
						/>
					</section>
					<section className="post-card__right-section">
						<PostHeader post={post} />
						<main>
							<h3>{post.title}</h3>
							<article>{post.body}</article>
						</main>
					</section>
				</section>
				<CommentForm loading={loading} onSubmit={onCommentCreate} />
				<section className="post-card__comments">
					<CommentList comments={rootComments} />
				</section>
			</div>
		</div>
	) : postLoading ? (
		<Loading />
	) : null;
};

export function loginToCreateComment(
	e: any,
	showNotification: (props: NotificationInput) => void
) {
	if (e === "You are not logged in") {
		showNotification({
			type: "error",
			message: "Login to create a comment",
		});
	} else {
		console.log(e);
	}
}
