import React from "react";
import { Link } from "react-router-dom";
import { DownvoteButton, UpvoteButton } from "components/icons/icons";
import { useSubreddit } from "contexts/SubredditContext";

interface SmallPostProps {
	post: IPost;
}

export const SmallPost: React.FC<SmallPostProps> = ({ post }) => {
	const { id: subredditId, name: subredditName } = useSubreddit();

	return (
		<div className="small-post">
			<section className="small-post__like-section">
				<UpvoteButton isActive={false} />
				<div>{post.likes.length - post.dislikes.length}</div>
				<DownvoteButton isActive={true} />
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
