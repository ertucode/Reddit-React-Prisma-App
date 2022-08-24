import { userLink } from "components/general/UserLink";
import { useAsync, useAsyncFn } from "hooks/useAsync";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { searchUsers } from "services/search";
import { followUser, unfollowUser } from "services/user";
import "../styles/user-search.scss";

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

	return loading ? (
		<div>"loading"</div>
	) : error ? (
		<div>"error"</div>
	) : (
		<div className="post-list searched-user__list">
			{localUsers?.map((user) => (
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
