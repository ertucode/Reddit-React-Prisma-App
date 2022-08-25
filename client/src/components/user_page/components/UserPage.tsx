import { useUser } from "contexts/UserContext";
import { BodyHeader } from "features/body_header/BodyHeader";
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

	const onFollowClicked = async () => {
		followUserFn
			.execute(userName)
			.then((r) => {
				setLocalUser((prevUser) => {
					if (prevUser)
						// Typescript is annoying
						return { ...prevUser, followedByMe: true };
				});
			})
			.catch((e) => console.log(e));
	};

	const onUnfollowClicked = async () => {
		unfollowUserFn
			.execute(userName)
			.then(() =>
				setLocalUser((prevUser) => {
					if (prevUser)
						// Typescript is annoying
						return { ...prevUser, followedByMe: false };
				})
			)
			.catch((e) => console.log(e));
	};

	return (
		<>
			{userLoading ? (
				<div>User Loading Page</div>
			) : userDoesNoTExist ? (
				<div>User Error Page</div>
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
