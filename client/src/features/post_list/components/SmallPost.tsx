import React from "react";
import { Link } from "react-router-dom";
import { useAsyncFn } from "hooks/useAsync";
import { togglePostLikeDislike } from "services/post";
import { ToggleOptions } from "services/comment";

import { ReactComponent as CommentSvg } from "../svg/comment.svg";
import { PostHeader } from "components/post/PostHeader";
import { useNotification } from "features/notification/contexts/NotificationProvider";
import {
	loginToVote,
	UpvoteDownvote,
} from "features/upvote_downvote/UpvoteDownvote";

interface SmallPostProps {
	post: IPost;
	mini: boolean;
	changeLocalPosts: (action: PostReducerAction) => void;
}

export const SmallPost: React.FC<SmallPostProps> = ({
	post,
	mini,
	changeLocalPosts,
}) => {
	const togglePostLikeDislikeFn = useAsyncFn(togglePostLikeDislike);

	const showNotification = useNotification();

	async function onTogglePostLikeDislike(option: ToggleOptions) {
		return togglePostLikeDislikeFn
			.execute(post?.id, option)
			.then((change) => {
				changeLocalPosts({
					type: "toggle",
					payload: {
						postId: post.id,
						change,
					},
				});
			})
			.catch((e) => {
				loginToVote(e, showNotification);
			});
	}

	return (
		<div className="small-post">
			<section className="small-post__like-section">
				<UpvoteDownvote
					post={post}
					upvoteCb={() => onTogglePostLikeDislike("Like")}
					downvoteCb={() => onTogglePostLikeDislike("Dislike")}
				/>
			</section>
			<section className={`${mini ? "mini-post-right" : ""}`}>
				<PostHeader post={post} />
				<main>
					<Link to={`/posts/${post.id}`}>
						<h3>{post.title}</h3>
						<article>{post.body}</article>
					</Link>
				</main>
				<footer>
					<button>
						<Link to={`/posts/${post.id}`}>
							<CommentSvg /> {post._count.comments} comments
						</Link>
					</button>
				</footer>
			</section>
		</div>
	);
};
