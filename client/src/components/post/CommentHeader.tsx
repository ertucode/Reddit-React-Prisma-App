import { UserLink } from "components/general/UserLink";
import React from "react";
import formatDate from "utils/formatDate";

interface CommentHeaderProps {
	comment: IComment;
}

export const CommentHeader: React.FC<CommentHeaderProps> = ({ comment }) => {
	return (
		<header className="comment-header">
			<span>
				<UserLink user={comment.user} />
			</span>
			<span className="sm-info">{formatDate(comment.createdAt)}</span>
		</header>
	);
};
