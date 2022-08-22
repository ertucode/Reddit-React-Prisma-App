import { Link } from "react-router-dom";
import React from "react";

interface UserLinkProps {
	user: IUser;
}

export const UserLink: React.FC<UserLinkProps> = ({ user }) => {
	return <Link to={`/u/${user.name}`}>u/{user.name}</Link>;
};
