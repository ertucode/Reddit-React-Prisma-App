import { SubredditLink } from "components/general/SubredditLink";
import { UserLink } from "components/general/UserLink";
import { NestLine } from "features/nest_line/NestLine";
import { useAsync } from "hooks/useAsync";
import React, { useEffect, useState } from "react";
import { getUserCommentsFromName } from "services/user";
import { ReactComponent as CommentSvg } from "features/post_list/svg/comment.svg";
import formatDate from "utils/formatDate";
import "../styles/comments.scss";
import { useNavigate } from "react-router-dom";

interface UserCommentListProps {
	userName: string;
}

const COMMENT_COUNT = 50;

interface PostMap {
	[key: string]: {
		post: IPost;
		comments: IComment[];
	};
}

export const UserCommentList: React.FC<UserCommentListProps> = ({
	userName,
}) => {
	const {
		loading,
		error,
		value: user,
	} = useAsync<IUser>(
		() => getUserCommentsFromName(userName, COMMENT_COUNT),
		[userName]
	);

	const [postMap, setPostMap] = useState<PostMap>({});
	const navigate = useNavigate();

	useEffect(() => {
		const newMap: PostMap = {};
		user?.comments?.forEach((comment) => {
			const id = comment.post.id;
			if (id in newMap) {
				newMap[id].comments.push(comment);
			} else {
				newMap[id] = { post: comment.post, comments: [comment] };
			}
		});
		setPostMap(newMap);
	}, [user]);

	if (userName == null) return <div>User does not exist</div>;

	return loading ? (
		<UserCommentLoading />
	) : error ? (
		<div>I was too lazy to handle this</div>
	) : (
		<div className="post-list">
			{Object.values(postMap)?.map(({ post, comments }) => (
				<div
					key={post.id}
					className="user-page-comment__post"
					onClick={() => navigate(`/posts/${post.id}`)}
					aria-label="Go to the post"
				>
					<header className="font-sm">
						<CommentSvg />
						<span className="ul-clr">
							<UserLink user={user!} />
						</span>
						<span className="sm-info">commented on</span>
						<span>{post.title}</span>
						<span className="has-left-dot bold">
							<SubredditLink subreddit={post.subreddit} />
						</span>
						<span className="has-left-dot sm-info">
							Posted by <UserLink user={post.user} />
						</span>
					</header>
					<main>
						{comments.map((comment) => (
							<div
								key={comment.id}
								className="user-page-comment__body"
							>
								{comment.parentId ? (
									<NestLine count={2} />
								) : (
									<>
										<NestLine />
									</>
								)}
								<div className="user-page-comment__body-comment">
									<header className="user-page-comment__header font-sm">
										<UserLink user={user!} />
										<span className="sm-info">
											{comment._count.likes -
												comment._count.dislikes}{" "}
											points
										</span>
										<span className="has-left-dot sm-info">
											{formatDate(comment.createdAt)}
										</span>
									</header>
									<main>{comment.body}</main>
								</div>
							</div>
						))}
					</main>
				</div>
			))}
		</div>
	);
};

export const UserCommentLoading: React.FC = () => {
	return (
		<div className="post-list">
			<div className="user-comment-loading card">
				<div className="user-comment-loading__child loading"></div>
				<div className="user-comment-loading__child loading"></div>
				<div className="user-comment-loading__child loading"></div>
			</div>
			<div className="user-comment-loading card">
				<div className="user-comment-loading__child loading"></div>
				<div className="user-comment-loading__child loading"></div>
				<div className="user-comment-loading__child loading"></div>
			</div>
		</div>
	);
};
