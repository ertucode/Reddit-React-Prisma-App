import { Link } from "react-router-dom";
import React from "react";

interface UserLinkProps {
	user: IUser;
}

export const userLink = (user: IUser) => `/u/${user.name}`;

export const UserLink: React.FC<UserLinkProps> = ({ user }) => {
	return (
		<Link
			to={userLink(user)}
			onClick={(e) => {
				e.stopPropagation();
				window.scrollTo(0, 0);
			}}
			className="user-link"
		>
			u/{user.name}{" "}
		</Link>
	);
};
