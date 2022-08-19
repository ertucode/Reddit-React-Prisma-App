import React from "react";
import { Link } from "react-router-dom";
import { DownvoteButton, UpvoteButton } from "components/icons/icons";
import { useSubreddit } from "contexts/SubredditContext";
import { useAsyncFn } from "hooks/useAsync";
import { togglePostLikeDislike } from "services/post";
import { ToggleOptions } from "services/comment";

interface SmallPostProps {
	post: IPost;
}

export const SmallPost: React.FC<SmallPostProps> = ({ post }) => {
	const {
		id: subredditId,
		name: subredditName,
		changeLocalPosts,
	} = useSubreddit();

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
			<section>
				<header>
					<Link to={`/subreddits/${subredditId}`}>
						r/{subredditName}
					</Link>
					<span className="sm-info">
						Posted by{" "}
						<Link to={`/users/${post.user.id}`}>
							u/{post.user.name}
						</Link>{" "}
					</span>
					<div className="sm-info">{post.createdAt}</div>
				</header>
				<main>
					<Link to={`/posts/${post.id}`}>
						<h3>{post.title}</h3>
						<article>{post.body}</article>
					</Link>
				</main>
			</section>
		</div>
	);
};
