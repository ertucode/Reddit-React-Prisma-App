import { userLink } from "components/general/UserLink";
import { useInfiniteScroll } from "features/infinite_scrolling/hooks/useInfiniteScroll";
import useSetListFromData from "features/search_page/hooks/useSetListFromData";
import { useAsyncFn } from "hooks/useAsync";
import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { getInfiniteSearchResult } from "services/infiniteScroll";
import { followUser, unfollowUser } from "services/user";
import "../styles/user-search.scss";

interface UserSearchResultProps {
	query: string;
}

export const UserSearchResult: React.FC<UserSearchResultProps> = ({
	query,
}) => {
	const followUserFn = useAsyncFn(followUser);
	const unfollowUserFn = useAsyncFn(unfollowUser);

	const [localUsers, setLocalUsers] = useState<IUser[]>([]);

	const getter = useCallback(
		() =>
			getInfiniteSearchResult(
				localUsers?.at(-1)?.createdAt?.toString(),
				"user",
				query
			),
		[query, localUsers]
	);

	const setter = useSetListFromData(localUsers, setLocalUsers);

	const { loading, error, LastDiv } = useInfiniteScroll(getter, setter);

	const onFollowClicked = async (name: string) => {
		followUserFn
			.execute(name)
			.then((user) => {
				setLocalUsers((prevUsers) =>
					prevUsers?.map((prevUser) => {
						if (prevUser.name === user.name) {
							return { ...prevUser, followedByMe: true };
						}
						return prevUser;
					})
				);
			})
			.catch((e) => console.log(e));
	};
	const onUnfollowClicked = async (name: string) => {
		unfollowUserFn
			.execute(name)
			.then((user) => {
				setLocalUsers((prevUsers) =>
					prevUsers?.map((prevUser) => {
						if (prevUser.name === user.name) {
							return {
								...prevUser,
								followedByMe: false,
							};
						}
						return prevUser;
					})
				);
			})
			.catch((e) => console.log(e));
	};

	return error ? (
		<div>"error"</div>
	) : (
		<div className="post-list searched-user__list">
			{localUsers?.map((user, index) => (
				<div key={user.id} className="searched-user">
					<div className="searched-user__left-side">
						<header>
							<Link to={userLink(user)}>{`r/${user.name}`}</Link>
							<span className="sm-info has-left-dot">
								{getUserKarma(user)} Karma
							</span>
						</header>
					</div>
					<div className="searched-user__right-side">
						{user.followedByMe ? (
							<button
								className="generic-btn-dark"
								onClick={() => onUnfollowClicked(user.name)}
							>
								Unfollow
							</button>
						) : (
							<button
								className="generic-btn"
								onClick={() => onFollowClicked(user.name)}
							>
								Follow
							</button>
						)}
					</div>
				</div>
			))}
			{LastDiv}
			{loading && <div>Loading</div>}
		</div>
	);
};

export const getUserKarma = (user: IUser) => {
	const c = user._count;
	return (
		c.likedComments +
		2 * c.likedPosts -
		c.dislikedComments -
		2 * c.dislikedPosts
	);
};
