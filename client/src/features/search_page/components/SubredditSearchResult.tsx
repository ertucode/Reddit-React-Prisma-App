import { subredditLink } from "components/general/SubredditLink";
import { useNotification } from "features/notification/contexts/NotificationProvider";
import { useAsyncFn } from "hooks/useAsync";
import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { joinSubreddit, leaveSubreddit } from "services/subreddit";
import "../styles/subreddit-search.scss";
import "../styles/flat-list-loading.scss";
import { NoMatch } from "./SearchPage";
import { useInfiniteScroll } from "features/infinite_scrolling/hooks/useInfiniteScroll";
import { getInfiniteSearchResult } from "services/infiniteScroll";
import useSetListFromData from "features/search_page/hooks/useSetListFromData";

interface SubredditSearchResultProps {
	query: string;
}

export const SubredditSearchResult: React.FC<SubredditSearchResultProps> = ({
	query,
}) => {
	const [localSubs, setLocalSubs] = useState<ISubreddit[]>([]);

	const getter = useCallback(
		() =>
			getInfiniteSearchResult(
				localSubs?.at(-1)?.createdAt?.toString(),
				"subreddit",
				query
			),
		[query, localSubs]
	);

	const setter = useSetListFromData(localSubs, setLocalSubs);

	const { loading, error, LastDiv } = useInfiniteScroll(getter, setter);

	const joinSubredditFn = useAsyncFn(joinSubreddit);
	const leaveSubredditFn = useAsyncFn(leaveSubreddit);

	const showNotification = useNotification();

	const onJoinClicked = async (name: string) => {
		joinSubredditFn
			.execute(name)
			.then((sub) => {
				setLocalSubs((prevSubs) =>
					prevSubs?.map((prevSub) => {
						if (prevSub.name === sub.name) {
							const _count = {
								...prevSub._count,
								subscribedUsers:
									prevSub._count.subscribedUsers + 1,
							};
							return { ...prevSub, subscribedByMe: true, _count };
						}
						return prevSub;
					})
				);
				showNotification({
					type: "success",
					message: `Joined r/${name}`,
				});
			})
			.catch((e) => {
				showNotification({
					type: "error",
					message: `Failed to join r/${name}`,
				});
				console.log(e);
			});
	};
	const onLeaveClicked = async (name: string) => {
		leaveSubredditFn
			.execute(name)
			.then((sub) => {
				setLocalSubs((prevSubs) =>
					prevSubs?.map((prevSub) => {
						if (prevSub.name === sub.name) {
							const _count = {
								...prevSub._count,
								subscribedUsers:
									prevSub._count.subscribedUsers - 1,
							};
							return {
								...prevSub,
								subscribedByMe: false,
								_count,
							};
						}
						return prevSub;
					})
				);
				showNotification({
					type: "success",
					message: `Left r/${name}`,
				});
			})
			.catch((e) => {
				showNotification({
					type: "error",
					message: `Failed to leave r/${name}`,
				});
				console.log(e);
			});
	};

	return error ? (
		<div>"error"</div>
	) : (
		<div className="post-list searched-subreddit__list">
			{localSubs &&
				localSubs.length > 0 &&
				localSubs.map((subreddit) => (
					<div key={subreddit.id} className="searched-subreddit">
						<div className="searched-subreddit__left-side">
							<header>
								<Link
									to={subredditLink(subreddit)}
								>{`r/${subreddit.name}`}</Link>
								<span className="sm-info has-left-dot">
									{subreddit._count.subscribedUsers} Members
								</span>
							</header>
							<div className="searched-subreddit__description">
								{subreddit.description}
							</div>
						</div>
						<div className="searched-subreddit__right-side">
							{subreddit.subscribedByMe ? (
								<button
									className="generic-btn-dark"
									onClick={() =>
										onLeaveClicked(subreddit.name)
									}
								>
									Leave
								</button>
							) : (
								<button
									className="generic-btn"
									onClick={() => {
										onJoinClicked(subreddit.name);
									}}
								>
									Join
								</button>
							)}
						</div>
					</div>
				))}
			{LastDiv}
			{loading ? (
				<div>"loading"</div>
			) : (
				localSubs.length === 0 && <NoMatch type="subreddit" />
			)}
		</div>
	);
};

export const FlatListLoading: React.FC = () => {
	return (
		<div className="post-list flat-list-loading">
			<div className="loading"></div>
			<div className="loading"></div>
			<div className="loading"></div>
			<div className="loading"></div>
		</div>
	);
};
