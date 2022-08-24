import React from "react";

interface UserSearchResultProps {
	query: string;
}

export const UserSearchResult: React.FC<UserSearchResultProps> = ({
	query,
}) => {
	return <div>UserSearchResult</div>;
};
