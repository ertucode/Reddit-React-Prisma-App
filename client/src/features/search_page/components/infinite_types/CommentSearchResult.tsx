import { CommentHeader } from "components/post/CommentHeader";
import { PostHeader } from "components/post/PostHeader";
import { useInfiniteScroll } from "features/infinite_scrolling/hooks/useInfiniteScroll";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInfiniteSearchResult } from "services/infiniteScroll";
import "../../styles/comment-search.scss";

interface CommentSearchResultProps {
	query: string;
}

export const CommentSearchResult: React.FC<CommentSearchResultProps> = ({
	query,
}) => {
	const { lastDivRef, loading, error, data, setPrevIndex } =
		useInfiniteScroll<IComment[]>((scrollIndex: string) =>
			getInfiniteSearchResult(scrollIndex, "comment", query)
		);
	const [comments, setComments] = useState<IComment[]>([]);

	useEffect(() => {
		console.log(data);
		if (data) {
			console.log(data?.at(-1)?.scrollIndex);
			setComments((prevComments) => {
				setPrevIndex(data?.at(-1)?.scrollIndex);
				if (
					data.length !== 0 &&
					data.at(-1)?.id !== prevComments.at(-1)?.id
				) {
					return [...prevComments, ...data];
				}
				return prevComments;
			});
		}
	}, [data]);

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
						ref={idx === comments.length - 2 ? lastDivRef : null}
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
			{loading && <div>"loading"</div>}
		</div>
	);
};
