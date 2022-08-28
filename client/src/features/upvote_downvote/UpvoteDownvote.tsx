import { DownvoteButton, UpvoteButton } from "components/icons/icons";
import React from "react";

interface UpvoteDownvoteProps {
	post: IPost;
	upvoteCb: () => void;
	downvoteCb: () => void;
}

export const UpvoteDownvote: React.FC<UpvoteDownvoteProps> = ({
	post,
	upvoteCb,
	downvoteCb,
}) => {
	return (
		<>
			<UpvoteButton isActive={post.likedByMe === 1} onClick={upvoteCb} />
			<div>{post._count.likes - post._count.dislikes}</div>
			<DownvoteButton
				isActive={post.likedByMe === -1}
				onClick={downvoteCb}
			/>
		</>
	);
};

export function loginToVote(
	e: any,
	showNotification: (props: NotificationInput) => void
) {
	if (e === "You are not logged in") {
		showNotification({
			type: "error",
			message: "Login to vote",
		});
	} else {
		console.log(e);
	}
}
