import { useUser } from "contexts/UserContext";
import { BodyHeader } from "features/body_header/BodyHeader";
import { useNotification } from "features/notification/contexts/NotificationProvider";
import { PlaceholderPostList } from "features/post_list/components/PostList";
import { useAsync, useAsyncFn } from "hooks/useAsync";
import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { followUser, getUserPageInfo, unfollowUser } from "services/user";
import { UserCommentList } from "./UserCommentList";
import { UserPostList } from "./UserPostList";

const VALID_TYPES = ["posts", "comments"];

export const UserPage: React.FC = () => {
	const { userName = "", type = "" } = useParams();
	const { currentUser } = useUser();

	const sameUser = userName === currentUser?.name;

	const {
		value: user,
		loading: userLoading,
		error: userDoesNoTExist,
	} = useAsync<IUser>(() => getUserPageInfo(userName), [userName]);

	const ElementToDisplay = useMemo(() => {
		switch (type) {
			case "posts":
				return <UserPostList userName={userName} />;
			case "comments":
				return <UserCommentList userName={userName} />;
			default:
				return <UserPostList userName={userName} />;
		}
	}, [type, userName]);

	const followUserFn = useAsyncFn(followUser);
	const unfollowUserFn = useAsyncFn(unfollowUser);

	const [localUser, setLocalUser] = useState<IUser>();

	useEffect(() => {
		setLocalUser(user);
	}, [user]);

	const showNotification = useNotification();

	const onFollowClicked = async () => {
		followUserFn
			.execute(userName)
			.then((r) => {
				setLocalUser((prevUser) => {
					if (prevUser)
						// Typescript is annoying
						return { ...prevUser, followedByMe: true };
				});
				showNotification({
					type: "success",
					message: `Followed r/${userName}`,
				});
			})
			.catch((e) => {
				showNotification({
					type: "error",
					message: `Failed to follow r/${userName}`,
				});
				console.log(e);
			});
	};

	const onUnfollowClicked = async () => {
		unfollowUserFn
			.execute(userName)
			.then(() => {
				setLocalUser((prevUser) => {
					if (prevUser)
						// Typescript is annoying
						return { ...prevUser, followedByMe: false };
				});

				showNotification({
					type: "success",
					message: `Unfollowed r/${userName}`,
				});
			})
			.catch((e) => {
				showNotification({
					type: "error",
					message: `Failed to unfollow r/${userName}`,
				});
				console.log(e);
			});
	};

	return (
		<>
			{userLoading ? (
				<UserLoadingPage />
			) : userDoesNoTExist ? (
				<NoUserPage />
			) : (
				<>
					<BodyHeader
						header={`u/${userName}`}
						rightChildren={
							!sameUser &&
							(localUser?.followedByMe ? (
								<div
									className="generic-btn-dark"
									onClick={onUnfollowClicked}
								>
									Unfollow
								</div>
							) : (
								<div
									className="generic-btn"
									onClick={onFollowClicked}
								>
									Follow
								</div>
							))
						}
					/>
					<ul className="page-navigation">
						<li>
							<NavLink
								to={`/u/${userName}/posts`}
								className={`${
									VALID_TYPES.includes(type) ? "" : "active"
								}`}
							>
								Posts
							</NavLink>
						</li>
						<li>
							<NavLink to={`/u/${userName}/comments`}>
								Comments
							</NavLink>
						</li>
					</ul>
					{ElementToDisplay}
				</>
			)}
		</>
	);
};

export const UserLoadingPage: React.FC = () => {
	const mockName = "loading";

	return (
		<>
			<BodyHeader header="_" />

			<ul className="page-navigation">
				<li>
					<NavLink to={`/u/${mockName}/posts`}>Posts</NavLink>
				</li>
				<li>
					<NavLink to={`/u/${mockName}/comments`}>Comments</NavLink>
				</li>
			</ul>

			<PlaceholderPostList />
		</>
	);
};

const NoUserPage = () => {
	return <div style={{ marginTop: "1rem" }}>User does not exist</div>;
};
