import React from "react";
import { Link } from "react-router-dom";
import { DownvoteButton, UpvoteButton } from "components/icons/icons";
import { useSubreddit } from "contexts/MultiplePostsContext";
import { useAsyncFn } from "hooks/useAsync";
import { togglePostLikeDislike } from "services/post";
import { ToggleOptions } from "services/comment";
import { UserLink } from "components/general/UserLink";
import { SubredditLink } from "components/general/SubredditLink";

import { ReactComponent as CommentSvg } from "./svg/comment.svg";

interface SmallPostProps {
	post: IPost;
}

export const SmallPost: React.FC<SmallPostProps> = ({ post }) => {
	const { changeLocalPosts } = useSubreddit();

	const togglePostLikeDislikeFn = useAsyncFn(togglePostLikeDislike);

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
			});
	}

	return (
		<div className="small-post">
			<section className="small-post__like-section">
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
			{/* mini-post-right */}
			<section>
				<header>
					<SubredditLink subreddit={post.subreddit} />
					<span className="sm-info">
						Posted by <UserLink user={post.user} />
					</span>
					<div className="sm-info">{post.createdAt}</div>
				</header>
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
