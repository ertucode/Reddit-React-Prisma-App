import React, { useEffect, useState } from "react";

import "components/subreddit/styles.scss";
import { BodyHeader } from "features/body_header/BodyHeader";
import { PostListWrapper } from "features/post_list/components/PostListWrapper";
import {
	getSubredditByName,
	getSubredditDescriptionAndSubbed,
	joinSubreddit,
	leaveSubreddit,
} from "services/subreddit";
import { useParams } from "react-router-dom";
import { MockForm } from "./MockForm";
import { useAsync, useAsyncFn } from "hooks/useAsync";
import { useNotification } from "features/notification/contexts/NotificationProvider";

interface SubredditProps {}

export const Subreddit: React.FC<SubredditProps> = () => {
	const { subredditName = "" } = useParams();
	const { loading: subLoading, value: sub } = useAsync<ISubreddit>(
		() => getSubredditDescriptionAndSubbed(subredditName),
		[subredditName]
	);
	const joinSubredditFn = useAsyncFn(joinSubreddit);
	const leaveSubredditFn = useAsyncFn(leaveSubreddit);

	const [localSub, setLocalSub] = useState<ISubreddit>();

	const showNotification = useNotification();

	useEffect(() => {
		setLocalSub(sub);
	}, [sub]);

	const onJoinClicked = async () => {
		joinSubredditFn
			.execute(subredditName)
			.then(() => {
				setLocalSub((prevSub) => {
					if (prevSub)
						// Typescript is annoying
						return { ...prevSub, subscribedByMe: true };
				});
				showNotification({
					type: "success",
					message: `Joined r/${subredditName}`,
				});
			})
			.catch((e) => {
				showNotification({
					type: "error",
					message: `Failed to join r/${subredditName}`,
				});
				console.log(e);
			});
	};

	const onLeaveClicked = async () => {
		leaveSubredditFn
			.execute(subredditName)
			.then(() => {
				setLocalSub((prevSub) => {
					if (prevSub)
						// Typescript is annoying
						return { ...prevSub, subscribedByMe: false };
				});
				showNotification({
					type: "success",
					message: `Left r/${subredditName}`,
				});
			})
			.catch((e) => {
				showNotification({
					type: "error",
					message: `Failed to leave r/${subredditName}`,
				});
				console.log(e);
			});
	};

	return (
		<>
			<BodyHeader
				header={`r/${subredditName}`}
				rightChildren={
					subLoading || !localSub ? null : localSub.subscribedByMe ? (
						<div
							className="generic-btn-dark"
							onClick={onLeaveClicked}
						>
							Leave
						</div>
					) : (
						<div className="generic-btn" onClick={onJoinClicked}>
							Join
						</div>
					)
				}
				bottomChildren={
					localSub?.description && (
						<div className="sm-info">{localSub.description}</div>
					)
				}
			/>
			<PostListWrapper
				getter={{
					callback: getSubredditByName,
					params: [subredditName],
				}}
			>
				<MockForm />
			</PostListWrapper>
		</>
	);
};
