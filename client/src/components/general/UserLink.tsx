import { Link } from "react-router-dom";
import React from "react";

interface UserLinkProps {
	user: IUser;
}

export const userLink = (user: IUser) => `/u/${user.name}`;

export const UserLink: React.FC<UserLinkProps> = ({ user }) => {
	return <Link to={userLink(user)}>u/{user.name}</Link>;
};
