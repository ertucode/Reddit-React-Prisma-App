import { CommentHeader } from "components/post/CommentHeader";
import { PostHeader } from "components/post/PostHeader";
import { useInfiniteScroll } from "features/infinite_scrolling/hooks/useInfiniteScroll";
import useSetListFromData from "features/search_page/hooks/useSetListFromData";
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getInfiniteSearchResult } from "services/infiniteScroll";
import "../styles/comment-search.scss";

interface CommentSearchResultProps {
	query: string;
}

export const CommentSearchResult: React.FC<CommentSearchResultProps> = ({
	query,
}) => {
	const [comments, setComments] = useState<IComment[]>([]);

	const getter = useCallback(
		() =>
			getInfiniteSearchResult(
				comments?.at(-1)?.createdAt?.toString(),
				"comment",
				query
			),
		[query, comments]
	);

	const setter = useSetListFromData(comments, setComments);

	const { loading, error, LastDiv } = useInfiniteScroll(getter, setter);

	const navigate = useNavigate();

	const handleBodyClick = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		postId: string
	) => {
		navigate(`/posts/${postId}`);
	};

	return error ? (
		<div>"error"</div>
	) : (
		<div className="post-list">
			{comments?.map((comment, idx) => {
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
								{post._count.likes - post._count.dislikes} votes
							</div>
							<div>{post._count.comments} comments</div>
						</footer>
					</div>
				);
			})}
			{LastDiv}
			{loading && <div>"loading"</div>}
		</div>
	);
};
