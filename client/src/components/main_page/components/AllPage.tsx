import { PostListWrapper } from "features/post_list/components/PostListWrapper";
import React from "react";
import "../styles/styles.scss";
import { getPosts } from "services/post";

export const AllPage: React.FC = () => {
	return (
		<div className="main-page-container">
			<PostListWrapper getter={{ callback: getPosts, params: [] }} />
		</div>
	);
};
