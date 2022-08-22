import React from "react";
import { useParams } from "react-router-dom";

export const UserPage: React.FC = () => {
	const { name } = useParams();

	console.log(name);

	return <div></div>;
};
