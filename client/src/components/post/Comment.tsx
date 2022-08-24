import React, { useState } from "react";
import {
	DownvoteButton,
	ExpandButton,
	ReplyButton,
	UpvoteButton,
} from "components/icons/icons";
import formatDate from "utils/formatDate";
import { UserLink } from "components/general/UserLink";
import { usePost } from "contexts/PostContext";
import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";
import {
	createComment,
	deleteComment,
	toggleCommentLikeDislike,
	ToggleOptions,
	updateComment,
} from "services/comment";
import { useUser } from "contexts/UserContext";
import { useAsyncFn } from "hooks/useAsync";
import { CommentHeader } from "./CommentHeader";

interface CommentProps {
	comment: IComment;
	hide?: boolean;
}

const collapsedStyle = {
	flexDirection: "row",
} as const;

export const Comment: React.FC<CommentProps> = ({ comment, hide }) => {
	const [collapsed, setCollapsed] = useState(false);
	const [isReplying, setIsReplying] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);

	const { currentUser } = useUser();

	const { getChildrenComments, post, changeLocalComments } = usePost();
	const createReplyFn = useAsyncFn(createComment);
	const updateCommentFn = useAsyncFn(updateComment);
	const deleteCommentFn = useAsyncFn(deleteComment);
	const toggleCommentLikeDislikeFn = useAsyncFn(toggleCommentLikeDislike);

	const childComments = getChildrenComments(comment.id);

	async function onCreateReply(body: string) {
		return createReplyFn
			.execute({ postId: post?.id, body, parentId: comment.id })
			.then((c: IComment) => {
				changeLocalComments({
					type: "create",
					payload: {
						comment: { ...c, likes: [], dislikes: [] },
					},
				});

				setIsReplying(false);
			});
	}

	async function onUpdateComment(body: string) {
		return updateCommentFn
			.execute({ postId: post?.id, body: body, commentId: comment.id })
			.then((c: IComment) => {
				changeLocalComments({
					type: "update",
					payload: {
						commentId: comment.id,
						body,
					},
				});
				setIsUpdating(false);
			});
	}

	async function onDeleteComment() {
		return deleteCommentFn
			.execute({ postId: post?.id, commentId: comment.id })
			.then((c) => {
				changeLocalComments({
					type: "delete",
					payload: {
						commentId: c.id,
					},
				});
			});
	}

	async function onToggleCommentLikeDislike(option: ToggleOptions) {
		return toggleCommentLikeDislikeFn
			.execute({ postId: post?.id, commentId: comment.id }, option)
			.then((change) => {
				changeLocalComments({
					type: "toggle",
					payload: {
						commentId: comment.id,
						change,
					},
				});
			});
	}

	return (
		<div className="comment" style={collapsed ? collapsedStyle : {}}>
			{collapsed && (
				<ExpandButton
					onClick={() => setCollapsed(false)}
					className="expand-btn"
				/>
			)}
			<CommentHeader comment={comment} />
			<div className={`nested-comments-stack`}>
				<button
					onClick={() => setCollapsed(true)}
					className={`${collapsed ? "hide" : ""} collapse-line`}
					aria-label="hide comment"
				></button>
				<div className="comment__body">
					<main className={`${collapsed ? "hide" : ""}`}>
						{isUpdating ? (
							<CommentForm
								loading={updateCommentFn.loading}
								error={updateCommentFn.error}
								onSubmit={onUpdateComment}
								autoFocus={true}
								initialValue={comment.body}
							/>
						) : (
							comment.body
						)}
					</main>
					<footer className={`${collapsed ? "hide" : ""}`}>
						<UpvoteButton
							isActive={comment.likedByMe === 1}
							onClick={() => onToggleCommentLikeDislike("Like")}
						/>
						<div>
							{comment._count.likes - comment._count.dislikes}
						</div>
						<DownvoteButton
							isActive={comment.likedByMe === -1}
							onClick={() =>
								onToggleCommentLikeDislike("Dislike")
							}
						/>
						<ReplyButton onClick={() => setIsReplying((r) => !r)} />
						<div>Save</div>
						{comment.user.id === currentUser?.id && (
							<>
								<button
									onClick={() => setIsUpdating((r) => !r)}
									className="footer-btn"
								>
									Edit
								</button>
								<button
									onClick={() => onDeleteComment()}
									className="footer-btn"
									disabled={deleteCommentFn.loading}
								>
									Delete
								</button>
							</>
						)}
					</footer>
					{isReplying && (
						<div>
							<CommentForm
								error={createReplyFn.error}
								loading={createReplyFn.loading}
								onSubmit={onCreateReply}
								autoFocus={true}
							/>
						</div>
					)}
					{childComments?.length && (
						<div className={`${collapsed ? "hide" : ""}`}>
							<div className={`nested-comments-stack`}>
								<div className="nested-comments">
									<CommentList comments={childComments} />
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
