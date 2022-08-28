import { userLink } from "components/general/UserLink";
import { useNotification } from "features/notification/contexts/NotificationProvider";
import { useAsync, useAsyncFn } from "hooks/useAsync";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { searchUsers } from "services/search";
import { followUser, unfollowUser } from "services/user";
import "../styles/user-search.scss";
import { NoMatch } from "./SearchPage";
import { FlatListLoading } from "./SubredditSearchResult";

interface UserSearchResultProps {
	query: string;
}

export const UserSearchResult: React.FC<UserSearchResultProps> = ({
	query,
}) => {
	const {
		value: users,
		loading,
		error,
	} = useAsync<IUser[]>(() => searchUsers(query, 20));
	const followUserFn = useAsyncFn(followUser);
	const unfollowUserFn = useAsyncFn(unfollowUser);

	const [localUsers, setLocalUsers] = useState<IUser[]>();

	useEffect(() => {
		setLocalUsers(users);
	}, [users]);

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
					message: `Followed r/${name}`,
				});
			})
			.catch((e) => {
				showNotification({
					type: "error",
					message: `Failed to follow r/${name}`,
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
					message: `Unfollowed r/${name}`,
				});
			})
			.catch((e) => {
				showNotification({
					type: "error",
					message: `Failed to unfollow r/${name}`,
				});
				console.log(e);
			});
	};

	return loading ? (
		<FlatListLoading />
	) : error ? (
		<div>"error"</div>
	) : (
		<div className="post-list searched-user__list">
			{localUsers && localUsers.length > 0 ? (
				localUsers?.map((user) => (
					<div key={user.id} className="searched-user">
						<div className="searched-user__left-side">
							<header>
								<Link
									to={userLink(user)}
								>{`r/${user.name}`}</Link>
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
				))
			) : (
				<NoMatch type="user" />
			)}
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
