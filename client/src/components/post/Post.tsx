import { usePost } from "contexts/PostContext";
import React from "react";
import { DownvoteButton, UpvoteButton } from "components/icons/icons";

import "./styles.scss";
import { CommentList } from "./CommentList";
import { UserLink } from "components/general/UserLink";
import { CommentForm } from "./CommentForm";
import { useAsyncFn } from "hooks/useAsync";
import { createComment, ToggleOptions } from "services/comment";
import { togglePostLikeDislike } from "services/post";
import { SubredditLink } from "components/general/SubredditLink";
import { PostHeader } from "./PostHeader";

interface PostProps {}

export const Post: React.FC<PostProps> = () => {
	const { post, rootComments, changeLocalComments, toggleLocalPostLike } =
		usePost();
	const {
		loading,
		error,
		execute: createCommentFn,
	} = useAsyncFn(createComment);
	const togglePostLikeDislikeFn = useAsyncFn(togglePostLikeDislike);

	async function onCommentCreate(body: string) {
		return createCommentFn({ postId: post?.id, body }).then(
			(comment: IComment) => {
				// CHECK THIS
				changeLocalComments({
					type: "create",
					payload: {
						comment: { ...comment },
					},
				});
			}
		);
	}

	async function onTogglePostLikeDislike(option: ToggleOptions) {
		return togglePostLikeDislikeFn.execute(post?.id, option).then((e) => {
			toggleLocalPostLike(post?.id || "", e);
		});
	}

	return post ? (
		<div className="post-card-container">
			<div className="post-card">
				<section className="post-card__top-section">
					<section className="post-card__like-section">
						<UpvoteButton
							isActive={post.likedByMe === 1}
							onClick={() => onTogglePostLikeDislike("Like")}
						/>
						<div>{post._count.likes - post._count.dislikes}</div>
						<DownvoteButton
							isActive={post.likedByMe === -1}
							onClick={() => onTogglePostLikeDislike("Dislike")}
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
				<CommentForm
					loading={loading}
					error={error}
					onSubmit={onCommentCreate}
				/>
				<section className="post-card__comments">
					<CommentList comments={rootComments} />
				</section>
			</div>
		</div>
	) : (
		<div>Loading</div>
	);
};
