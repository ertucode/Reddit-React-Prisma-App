import { Modal } from "features/modal/components/Modal";
import { useMultiplePosts } from "features/post_list/components/PostListWrapper";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { PostForm } from "./PostForm";

export const MockForm: React.FC = () => {
	const [open, setOpen] = useState(false);
	const { subredditName } = useParams();
	const { changeLocalPosts } = useMultiplePosts();

	return (
		<div className="mock-form">
			<input
				placeholder="Create Post"
				aria-label="Click to create a post"
				onClick={(e) => {
					setOpen(true);
				}}
			></input>
			{open && (
				<Modal setOpen={setOpen} modalClassName="post-form-modal">
					<PostForm
						subredditName={subredditName || ""}
						changeLocalPosts={(action: any) => {
							setOpen(false);
							changeLocalPosts(action);
						}}
					/>
				</Modal>
			)}
		</div>
	);
};
