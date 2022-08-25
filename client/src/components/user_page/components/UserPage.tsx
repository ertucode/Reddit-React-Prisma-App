import { BodyHeader } from "features/body_header/BodyHeader";
import React, { useMemo } from "react";
import { NavLink, useParams } from "react-router-dom";
import { UserCommentList } from "./UserCommentList";
import { UserPostList } from "./UserPostList";

const VALID_TYPES = ["posts", "comments"];

export const UserPage: React.FC = () => {
	const { userName = "", type = "" } = useParams();

	// await username -> sorry nobody on reddit goes by that name

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

	return (
		<>
			<BodyHeader header={`u/${userName}`} />
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
					<NavLink to={`/u/${userName}/comments`}>Comments</NavLink>
				</li>
			</ul>
			{ElementToDisplay}
		</>
	);
};
