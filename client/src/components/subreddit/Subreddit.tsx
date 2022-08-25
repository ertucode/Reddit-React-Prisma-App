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

	useEffect(() => {
		setLocalSub(sub);
	}, [sub]);

	const onJoinClicked = async () => {
		joinSubredditFn
			.execute(subredditName)
			.then(() =>
				setLocalSub((prevSub) => {
					if (prevSub)
						// Typescript is annoying
						return { ...prevSub, subscribedByMe: true };
				})
			)
			.catch((e) => console.log(e));
	};

	const onLeaveClicked = async () => {
		leaveSubredditFn
			.execute(subredditName)
			.then(() =>
				setLocalSub((prevSub) => {
					if (prevSub)
						// Typescript is annoying
						return { ...prevSub, subscribedByMe: false };
				})
			)
			.catch((e) => console.log(e));
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
