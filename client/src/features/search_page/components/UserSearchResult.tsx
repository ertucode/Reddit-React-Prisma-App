import { userLink } from "components/general/UserLink";
import { useInfiniteScroll } from "features/infinite_scrolling/hooks/useInfiniteScroll";
import { Loading } from "features/loading/Loading";
import { useNotification } from "features/notification/contexts/NotificationProvider";
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

	const showNotification = useNotification();

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
				showNotification({
					type: "success",
					message: `Followed u/${name}`,
				});
			})
			.catch((e) => {
				showNotification({
					type: "error",
					message: `Failed to follow u/${name}`,
				});
				console.log(e);
			});
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
				showNotification({
					type: "success",
					message: `Unfollowed u/${name}`,
				});
			})
			.catch((e) => {
				showNotification({
					type: "error",
					message: `Failed to unfollow u/${name}`,
				});
				console.log(e);
			});
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
								className="secondary-btn"
								onClick={() => onUnfollowClicked(user.name)}
								disabled={unfollowUserFn.loading}
							>
								Unfollow
							</button>
						) : (
							<button
								className="primary-btn"
								onClick={() => onFollowClicked(user.name)}
								disabled={followUserFn.loading}
							>
								Follow
							</button>
						)}
					</div>
				</div>
			))}
			{LastDiv}
			{loading && <Loading />}
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
