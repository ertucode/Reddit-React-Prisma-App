import { subredditLink } from "components/general/SubredditLink";
import { useAsync, useAsyncFn } from "hooks/useAsync";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { searchSubreddits } from "services/search";
import { joinSubreddit, leaveSubreddit } from "services/subreddit";
import "../styles/subreddit-search.scss";

interface SubredditSearchResultProps {
	query: string;
}

export const SubredditSearchResult: React.FC<SubredditSearchResultProps> = ({
	query,
}) => {
	const {
		value: subreddits,
		loading,
		error,
	} = useAsync<ISubreddit[]>(() => searchSubreddits(query, 20));
	const joinSubredditFn = useAsyncFn(joinSubreddit);
	const leaveSubredditFn = useAsyncFn(leaveSubreddit);

	const [localSubs, setLocalSubs] = useState<ISubreddit[]>();

	useEffect(() => {
		setLocalSubs(subreddits);
	}, [subreddits]);

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
			})
			.catch((e) => console.log(e));
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
			})
			.catch((e) => console.log(e));
	};

	return loading ? (
		<div>"loading"</div>
	) : error ? (
		<div>"error"</div>
	) : (
		<div className="post-list searched-subreddit__list">
			{localSubs?.map((subreddit) => (
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
								onClick={() => onLeaveClicked(subreddit.name)}
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
		</div>
	);
};
