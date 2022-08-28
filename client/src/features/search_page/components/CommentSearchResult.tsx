import { CommentHeader } from "components/post/CommentHeader";
import { PostHeader } from "components/post/PostHeader";
import { UserCommentLoading } from "components/user_page/components/UserCommentList";
import { useAsync } from "hooks/useAsync";
import React from "react";
import { useNavigate } from "react-router-dom";
import { searchComments } from "services/search";
import "../styles/comment-search.scss";
import { NoMatch } from "./SearchPage";

interface CommentSearchResultProps {
	query: string;
}

export const CommentSearchResult: React.FC<CommentSearchResultProps> = ({
	query,
}) => {
	const {
		value: comments,
		loading,
		error,
	} = useAsync<IComment[]>(() => searchComments(query, 20));

	const navigate = useNavigate();

	const handleBodyClick = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		postId: string
	) => {
		navigate(`/posts/${postId}`);
	};

	return loading ? (
		<UserCommentLoading />
	) : error ? (
		<div>"error"</div>
	) : (
		<div className="post-list">
			{comments && comments.length > 0 ? (
				comments?.map((comment) => {
					const post = comment.post;
					return (
						<div
							className="searched-comment"
							key={comment.id}
							tabIndex={0}
							aria-label="Go to post"
							onClick={(e) => handleBodyClick(e, post.id)}
						>
							<PostHeader post={post} />
							<div className="searched-comment__post-title">
								{post.title}
							</div>
							<div className="searched-comment__comment-body">
								<CommentHeader comment={comment} />
								<article>{comment.body}</article>
								<footer>
									<div>
										{comment._count.likes -
											comment._count.dislikes}{" "}
										votes
									</div>
								</footer>
							</div>
							<footer>
								<div>
									{post._count.likes - post._count.dislikes}{" "}
									votes
								</div>
								<div>{post._count.comments} comments</div>
							</footer>
						</div>
					);
				})
			) : (
				<NoMatch type="comment" />
			)}
		</div>
	);
};
